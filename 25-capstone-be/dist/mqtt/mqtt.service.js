"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MqttService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mqtt = require("mqtt");
const rxjs_1 = require("rxjs");
const prisma_service_1 = require("../prisma/prisma.service");
let MqttService = class MqttService {
    configService;
    prisma;
    client;
    seatStatusSubject = new rxjs_1.Subject();
    moduleStatusSubject = new rxjs_1.Subject();
    connectionStatus = new rxjs_1.BehaviorSubject(false);
    region;
    defaultReservationMinutes;
    seatStatusUpdates$ = this.seatStatusSubject.asObservable();
    moduleStatusUpdates$ = this.moduleStatusSubject.asObservable();
    connectionStatus$ = this.connectionStatus.asObservable();
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
        this.region = this.configService.get('MQTT_REGION', 'KR');
        this.defaultReservationMinutes = parseInt(this.configService.get('DEFAULT_RESERVATION_MINUTES', '2'));
    }
    async onModuleInit() {
        await this.connect();
        this.setupEventListeners();
    }
    async onModuleDestroy() {
        if (this.client) {
            this.client.end();
            console.log('🔌 MQTT client disconnected');
        }
    }
    async connect() {
        const brokerUrl = this.configService.get('MQTT_BROKER_URL');
        const username = this.configService.get('MQTT_USERNAME');
        const password = this.configService.get('MQTT_PASSWORD');
        console.log(`🔌 Connecting to MQTT broker: ${brokerUrl}`);
        this.client = mqtt.connect(brokerUrl, {
            username,
            password,
            reconnectPeriod: 5000,
            connectTimeout: 30000,
        });
        this.client.on('connect', () => {
            console.log('✅ MQTT connected successfully');
            this.connectionStatus.next(true);
            this.subscribeToTopics();
        });
        this.client.on('error', (error) => {
            console.error('❌ MQTT connection error:', error);
            this.connectionStatus.next(false);
        });
        this.client.on('offline', () => {
            console.log('⚠️ MQTT client offline');
            this.connectionStatus.next(false);
        });
        this.client.on('reconnect', () => {
            console.log('🔄 MQTT reconnecting...');
        });
        this.client.on('message', (topic, message) => {
            this.handleMessage(topic, message);
        });
    }
    subscribeToTopics() {
        const mainTopic = `msh/${this.region}/2/json/Main/#`;
        const seatStateTopic = `msh/${this.region}/2/json/SeatState/#`;
        this.client.subscribe([mainTopic, seatStateTopic], (error) => {
            if (error) {
                console.error('❌ MQTT subscription error:', error);
            }
            else {
                console.log(`📡 Subscribed to topics: ${mainTopic}, ${seatStateTopic}`);
            }
        });
    }
    async handleMessage(topic, message) {
        try {
            console.log(`📨 Received message on topic: ${topic}`);
            const data = JSON.parse(message.toString());
            if (topic.includes('/json/SeatState/')) {
                await this.handleSeatStatusMessage(data);
            }
            if (topic.includes('/json/Main/')) {
                await this.handleMainChannelMessage(data);
            }
        }
        catch (error) {
            console.error('❌ Error handling JSON MQTT message:', error);
        }
    }
    async handleSeatStatusMessage(payload) {
        const moduleId = payload.from;
        const occupied = payload.payload.occupied ?? false;
        const timestamp = new Date();
        console.log(`🪑 Seat status update - Module: ${moduleId}, Occupied: ${occupied}`);
        const seatModule = await this.prisma.seatModule.upsert({
            where: { id: moduleId },
            update: {
                occupied,
                lastUpdated: timestamp,
            },
            create: {
                id: moduleId,
                occupied,
                lastUpdated: timestamp,
            },
            include: {
                seat: true,
            },
        });
        this.seatStatusSubject.next({
            moduleId,
            occupied,
            timestamp,
            seatId: seatModule.seat?.id,
            layoutId: seatModule.seat?.layoutId,
        });
    }
    async handleMainChannelMessage(data) {
        const moduleId = data.from;
        if (!moduleId) {
            console.warn('⚠️ No sender (moduleId) in Main channel message');
            return;
        }
        console.log(`📊 Main channel message from module: ${moduleId}, Type: ${data.type}`);
        if (data.payload) {
            const deviceMetrics = data.payload;
            const timestamp = new Date();
            await this.prisma.seatModuleStatus.upsert({
                where: { id: moduleId.toString() },
                update: {
                    batteryLevel: deviceMetrics.battery_level,
                    voltage: deviceMetrics.voltage,
                    uptimeSec: deviceMetrics.uptime_seconds,
                    lastSeen: timestamp,
                },
                create: {
                    id: moduleId.toString(),
                    batteryLevel: deviceMetrics.battery_level ?? 0,
                    voltage: deviceMetrics.voltage ?? 0,
                    uptimeSec: deviceMetrics.uptime_seconds ?? 0,
                    lastSeen: timestamp,
                },
            });
            this.moduleStatusSubject.next({
                moduleId,
                batteryLevel: deviceMetrics.battery_level,
                voltage: deviceMetrics.voltage,
                uptimeSec: deviceMetrics.uptime_seconds,
                lastSeen: timestamp,
            });
        }
    }
    setupEventListeners() {
        this.seatStatusUpdates$.subscribe(async (update) => {
            console.log(`🪑 Processing seat status update:`, update);
        });
        this.moduleStatusUpdates$.subscribe(async (update) => {
            console.log(`📊 Processing module status update:`, update);
        });
    }
    async sendTemporaryReservation(moduleId, minutes) {
        try {
            const reservationMinutes = minutes ?? this.defaultReservationMinutes;
            console.log(`🔒 Sending temporary reservation to module ${moduleId} for ${reservationMinutes} minutes`);
            const command = {
                to: moduleId,
                payload: {
                    occupied: true,
                },
            };
            const topic = `msh/${this.region}/2/json/SeatState/!gateway`;
            const payload = JSON.stringify(command);
            return new Promise((resolve) => {
                this.client.publish(topic, payload, (error) => {
                    if (error) {
                        console.error('❌ Failed to send temporary reservation:', error);
                        resolve(false);
                    }
                    else {
                        console.log('✅ Temporary reservation sent successfully');
                        resolve(true);
                    }
                });
            });
        }
        catch (error) {
            console.error('❌ Error sending temporary reservation:', error);
            return false;
        }
    }
    async requestStatusRefresh(moduleId) {
        try {
            console.log(`🔄 Requesting status refresh from module ${moduleId}`);
            const command = {
                to: parseInt(moduleId),
                want_response: true,
                payload: {
                    request_status: true,
                },
            };
            const topic = `msh/${this.region}/2/json/Main/!gateway`;
            const payload = JSON.stringify(command);
            return new Promise((resolve) => {
                this.client.publish(topic, payload, (error) => {
                    if (error) {
                        console.error('❌ Failed to request status refresh:', error);
                        resolve(false);
                    }
                    else {
                        console.log('✅ Status refresh request sent successfully');
                        resolve(true);
                    }
                });
            });
        }
        catch (error) {
            console.error('❌ Error requesting status refresh:', error);
            return false;
        }
    }
    isConnected() {
        return this.connectionStatus.value;
    }
};
exports.MqttService = MqttService;
exports.MqttService = MqttService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], MqttService);
//# sourceMappingURL=mqtt.service.js.map
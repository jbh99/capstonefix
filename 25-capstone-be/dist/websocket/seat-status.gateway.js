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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeatStatusGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const mqtt_service_1 = require("../mqtt/mqtt.service");
const layout_service_1 = require("../layout/layout.service");
let SeatStatusGateway = class SeatStatusGateway {
    mqttService;
    layoutService;
    server;
    layoutSubscriptions = new Map();
    socketLayouts = new Map();
    constructor(mqttService, layoutService) {
        this.mqttService = mqttService;
        this.layoutService = layoutService;
        this.setupMqttListeners();
    }
    handleConnection(client) {
        console.log(`🔌 WebSocket client connected: ${client.id}`);
        client.emit('connection-status', {
            connected: true,
            mqttConnected: this.mqttService.isConnected(),
        });
    }
    handleDisconnect(client) {
        console.log(`🔌 WebSocket client disconnected: ${client.id}`);
        const layoutId = this.socketLayouts.get(client.id);
        if (layoutId) {
            const subscribers = this.layoutSubscriptions.get(layoutId);
            if (subscribers) {
                subscribers.delete(client.id);
                if (subscribers.size === 0) {
                    this.layoutSubscriptions.delete(layoutId);
                }
            }
            this.socketLayouts.delete(client.id);
        }
    }
    async handleLayoutSubscription(data, client) {
        const { layoutId } = data;
        console.log(`📡 Client ${client.id} subscribing to layout: ${layoutId}`);
        try {
            await this.layoutService.getLayoutSeats(layoutId);
            const previousLayoutId = this.socketLayouts.get(client.id);
            if (previousLayoutId) {
                const previousSubscribers = this.layoutSubscriptions.get(previousLayoutId);
                if (previousSubscribers) {
                    previousSubscribers.delete(client.id);
                    if (previousSubscribers.size === 0) {
                        this.layoutSubscriptions.delete(previousLayoutId);
                    }
                }
            }
            if (!this.layoutSubscriptions.has(layoutId)) {
                this.layoutSubscriptions.set(layoutId, new Set());
            }
            this.layoutSubscriptions.get(layoutId).add(client.id);
            this.socketLayouts.set(client.id, layoutId);
            const currentStatus = await this.layoutService.getLayoutSeatStatus(layoutId);
            client.emit('layout-status', {
                layoutId,
                seats: currentStatus,
                timestamp: new Date(),
            });
            client.emit('subscription-confirmed', {
                layoutId,
                message: `Successfully subscribed to layout ${layoutId}`,
            });
        }
        catch (error) {
            console.error(`❌ Error subscribing to layout ${layoutId}:`, error);
            client.emit('subscription-error', {
                layoutId,
                error: error.message,
            });
        }
    }
    handleLayoutUnsubscription(data, client) {
        const { layoutId } = data;
        console.log(`📡 Client ${client.id} unsubscribing from layout: ${layoutId}`);
        const subscribers = this.layoutSubscriptions.get(layoutId);
        if (subscribers) {
            subscribers.delete(client.id);
            if (subscribers.size === 0) {
                this.layoutSubscriptions.delete(layoutId);
            }
        }
        if (this.socketLayouts.get(client.id) === layoutId) {
            this.socketLayouts.delete(client.id);
        }
        client.emit('unsubscription-confirmed', {
            layoutId,
            message: `Successfully unsubscribed from layout ${layoutId}`,
        });
    }
    handlePing(client) {
        client.emit('pong', {
            timestamp: new Date(),
            mqttConnected: this.mqttService.isConnected(),
        });
    }
    setupMqttListeners() {
        this.mqttService.seatStatusUpdates$.subscribe(async (update) => {
            if (update.seatId) {
                await this.broadcastSeatUpdate(update);
            }
        });
        this.mqttService.moduleStatusUpdates$.subscribe(async (update) => {
            await this.broadcastModuleUpdate(update);
        });
        this.mqttService.connectionStatus$.subscribe((connected) => {
        });
    }
    async broadcastSeatUpdate(update) {
        if (!update.seatId)
            return;
        if (!update.layoutId)
            return;
        try {
            const targetLayoutId = update.layoutId;
            console.log();
            const subscribers = this.layoutSubscriptions.get(targetLayoutId);
            if (!subscribers || subscribers.size === 0)
                return;
            const seatUpdateData = {
                seatId: update.seatId,
                moduleId: update.moduleId,
                occupied: update.occupied,
                timestamp: update.timestamp,
            };
            console.log(`📡 Broadcasting seat update to ${subscribers.size} subscribers:`, seatUpdateData);
            subscribers.forEach((socketId) => {
                const socket = this.server.sockets.sockets.get(socketId);
                if (socket) {
                    socket.emit('seat-update', seatUpdateData);
                }
            });
        }
        catch (error) {
            console.error('❌ Error broadcasting seat update:', error);
        }
    }
    async broadcastModuleUpdate(update) {
        this.server.emit('module-status-update', {
            moduleId: update.moduleId,
            batteryLevel: update.batteryLevel,
            voltage: update.voltage,
            uptimeSec: update.uptimeSec,
            lastSeen: update.lastSeen,
        });
    }
    getSubscriptionStats() {
        const stats = {
            totalLayouts: this.layoutSubscriptions.size,
            totalConnections: this.socketLayouts.size,
            layoutSubscriptions: {},
        };
        this.layoutSubscriptions.forEach((subscribers, layoutId) => {
            stats.layoutSubscriptions[layoutId] = subscribers.size;
        });
        return stats;
    }
};
exports.SeatStatusGateway = SeatStatusGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], SeatStatusGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribe-layout'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], SeatStatusGateway.prototype, "handleLayoutSubscription", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('unsubscribe-layout'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], SeatStatusGateway.prototype, "handleLayoutUnsubscription", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('ping'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], SeatStatusGateway.prototype, "handlePing", null);
exports.SeatStatusGateway = SeatStatusGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    }),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mqtt_service_1.MqttService,
        layout_service_1.LayoutService])
], SeatStatusGateway);
//# sourceMappingURL=seat-status.gateway.js.map
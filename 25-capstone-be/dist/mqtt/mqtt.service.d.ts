import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
export interface SeatStatePayload {
    channel: number;
    from: number;
    payload: SeatState;
    sender: string;
    timestamp: number;
    to: number;
    type: string;
}
export interface MqttMainPayload {
    channel: number;
    from: number;
    payload: DeviceMetrics | any;
    sender: string;
    timestamp: number;
    to: number;
    type: string;
}
export interface DeviceMetrics {
    battery_level?: number;
    voltage?: number;
    uptime_seconds?: number;
}
export interface SeatState {
    occupied: boolean;
}
export interface SeatStatusUpdate {
    moduleId: number;
    occupied: boolean;
    timestamp: Date;
    seatId?: string;
    layoutId?: string;
}
export interface ModuleStatusUpdate {
    moduleId: number;
    batteryLevel?: number;
    voltage?: number;
    uptimeSec?: number;
    lastSeen: Date;
}
export declare class MqttService implements OnModuleInit, OnModuleDestroy {
    private readonly configService;
    private readonly prisma;
    private client;
    private readonly seatStatusSubject;
    private readonly moduleStatusSubject;
    private readonly connectionStatus;
    private readonly region;
    private readonly defaultReservationMinutes;
    readonly seatStatusUpdates$: import("rxjs").Observable<SeatStatusUpdate>;
    readonly moduleStatusUpdates$: import("rxjs").Observable<ModuleStatusUpdate>;
    readonly connectionStatus$: import("rxjs").Observable<boolean>;
    constructor(configService: ConfigService, prisma: PrismaService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private connect;
    private subscribeToTopics;
    private handleMessage;
    private handleSeatStatusMessage;
    private handleMainChannelMessage;
    private setupEventListeners;
    sendTemporaryReservation(moduleId: number, minutes?: number): Promise<boolean>;
    requestStatusRefresh(moduleId: string): Promise<boolean>;
    isConnected(): boolean;
}

import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MqttService } from '../mqtt/mqtt.service';
import { LayoutService } from '../layout/layout.service';
export declare class SeatStatusGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly mqttService;
    private readonly layoutService;
    server: Server;
    private layoutSubscriptions;
    private socketLayouts;
    constructor(mqttService: MqttService, layoutService: LayoutService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleLayoutSubscription(data: {
        layoutId: string;
    }, client: Socket): Promise<void>;
    handleLayoutUnsubscription(data: {
        layoutId: string;
    }, client: Socket): void;
    handlePing(client: Socket): void;
    private setupMqttListeners;
    private broadcastSeatUpdate;
    private broadcastModuleUpdate;
    getSubscriptionStats(): {
        totalLayouts: number;
        totalConnections: number;
        layoutSubscriptions: Record<string, number>;
    };
}

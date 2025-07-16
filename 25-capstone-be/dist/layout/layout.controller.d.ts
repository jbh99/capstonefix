import { LayoutService } from './layout.service';
import { MqttService } from '../mqtt/mqtt.service';
import { CreateLayoutDto, CreateSeatDto, ReserveSeatDto } from './dto/layout.dto';
export declare class LayoutController {
    private readonly layoutService;
    private readonly mqttService;
    constructor(layoutService: LayoutService, mqttService: MqttService);
    getInitialLayouts(): Promise<({
        seats: ({
            module: {
                id: number;
                occupied: boolean;
                lastUpdated: Date;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            seatName: string;
            seatX: number;
            seatY: number;
            layoutId: string;
            moduleId: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        location: string;
        canvasSize: string;
    })[]>;
    getLayoutSeats(layoutId: string): Promise<({
        module: {
            id: number;
            occupied: boolean;
            lastUpdated: Date;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        seatName: string;
        seatX: number;
        seatY: number;
        layoutId: string;
        moduleId: number;
    })[]>;
    getLayoutSeatStatus(layoutId: string): Promise<{
        seatId: string;
        seatName: string;
        moduleId: number;
        occupied: boolean;
        lastUpdated: Date;
    }[]>;
    reserveSeat(layoutId: string, seatId: string, reserveSeatDto: ReserveSeatDto): Promise<{
        success: boolean;
        message: string;
        reservationMinutes: number;
    }>;
    createLayout(createLayoutDto: CreateLayoutDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        location: string;
        canvasSize: string;
    }>;
    createSeat(createSeatDto: CreateSeatDto): Promise<{
        layout: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            location: string;
            canvasSize: string;
        };
        module: {
            id: number;
            occupied: boolean;
            lastUpdated: Date;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        seatName: string;
        seatX: number;
        seatY: number;
        layoutId: string;
        moduleId: number;
    }>;
    getUnassignedModules(): Promise<{
        id: number;
        occupied: boolean;
        lastUpdated: Date;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    assignModuleToSeat(seatId: string, moduleId: number): Promise<{
        layout: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            location: string;
            canvasSize: string;
        };
        module: {
            id: number;
            occupied: boolean;
            lastUpdated: Date;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        seatName: string;
        seatX: number;
        seatY: number;
        layoutId: string;
        moduleId: number;
    }>;
    refreshModuleStatus(moduleId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}

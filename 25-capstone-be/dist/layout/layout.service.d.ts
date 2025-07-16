import { PrismaService } from '../prisma/prisma.service';
import { CreateLayoutDto, CreateSeatDto } from './dto/layout.dto';
export declare class LayoutService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAllLayouts(): Promise<({
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
    getUnassignedModules(): Promise<{
        id: number;
        occupied: boolean;
        lastUpdated: Date;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}

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
exports.LayoutService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let LayoutService = class LayoutService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllLayouts() {
        console.log('📋 Fetching all layouts');
        return this.prisma.seatLayout.findMany({
            include: {
                seats: {
                    include: {
                        module: true,
                    },
                },
            },
        });
    }
    async getLayoutSeats(layoutId) {
        console.log(`📋 Fetching seats for layout: ${layoutId}`);
        const layout = await this.prisma.seatLayout.findUnique({
            where: { id: layoutId },
            include: {
                seats: {
                    include: {
                        module: true,
                    },
                },
            },
        });
        if (!layout) {
            throw new common_1.NotFoundException(`Layout with ID ${layoutId} not found`);
        }
        return layout.seats;
    }
    async getLayoutSeatStatus(layoutId) {
        console.log(`📊 Fetching seat status for layout: ${layoutId}`);
        const layout = await this.prisma.seatLayout.findUnique({
            where: { id: layoutId },
            include: {
                seats: {
                    include: {
                        module: true,
                    },
                },
            },
        });
        if (!layout) {
            throw new common_1.NotFoundException(`Layout with ID ${layoutId} not found`);
        }
        return layout.seats.map((seat) => ({
            seatId: seat.id,
            seatName: seat.seatName,
            moduleId: seat.moduleId,
            occupied: seat.module.occupied,
            lastUpdated: seat.module.lastUpdated,
        }));
    }
    async createLayout(createLayoutDto) {
        console.log('🆕 Creating new layout:', createLayoutDto);
        return this.prisma.seatLayout.create({
            data: createLayoutDto,
        });
    }
    async createSeat(createSeatDto) {
        console.log('🆕 Creating new seat:', createSeatDto);
        const layout = await this.prisma.seatLayout.findUnique({
            where: { id: createSeatDto.layoutId },
        });
        if (!layout) {
            throw new common_1.NotFoundException(`Layout with ID ${createSeatDto.layoutId} not found`);
        }
        const existingSeat = await this.prisma.seat.findUnique({
            where: { seatName: createSeatDto.seatName },
        });
        if (existingSeat) {
            throw new common_1.BadRequestException(`Seat with name ${createSeatDto.seatName} already exists`);
        }
        const module = await this.prisma.seatModule.upsert({
            where: { id: createSeatDto.moduleId },
            update: {},
            create: {
                id: createSeatDto.moduleId,
            },
        });
        return this.prisma.seat.create({
            data: createSeatDto,
            include: {
                module: true,
                layout: true,
            },
        });
    }
    async assignModuleToSeat(seatId, moduleId) {
        console.log(`🔗 Assigning module ${moduleId} to seat ${seatId}`);
        const seat = await this.prisma.seat.findUnique({
            where: { id: seatId },
        });
        if (!seat) {
            throw new common_1.NotFoundException(`Seat with ID ${seatId} not found`);
        }
        const module = await this.prisma.seatModule.upsert({
            where: { id: moduleId },
            update: {},
            create: {
                id: moduleId,
            },
        });
        return this.prisma.seat.update({
            where: { id: seatId },
            data: { moduleId },
            include: {
                module: true,
                layout: true,
            },
        });
    }
    async getUnassignedModules() {
        console.log('📋 Fetching unassigned modules');
        return this.prisma.seatModule.findMany({
            where: {
                seat: null,
            },
        });
    }
};
exports.LayoutService = LayoutService;
exports.LayoutService = LayoutService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LayoutService);
//# sourceMappingURL=layout.service.js.map
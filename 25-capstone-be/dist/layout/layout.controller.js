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
exports.LayoutController = void 0;
const common_1 = require("@nestjs/common");
const layout_service_1 = require("./layout.service");
const mqtt_service_1 = require("../mqtt/mqtt.service");
const layout_dto_1 = require("./dto/layout.dto");
let LayoutController = class LayoutController {
    layoutService;
    mqttService;
    constructor(layoutService, mqttService) {
        this.layoutService = layoutService;
        this.mqttService = mqttService;
    }
    async getInitialLayouts() {
        console.log('🌐 GET /layout/init - Fetching initial layouts');
        return this.layoutService.getAllLayouts();
    }
    async getLayoutSeats(layoutId) {
        console.log(`🌐 GET /layout/seats?layoutid=${layoutId}`);
        if (!layoutId) {
            throw new common_1.BadRequestException('layoutid query parameter is required');
        }
        return this.layoutService.getLayoutSeats(layoutId);
    }
    async getLayoutSeatStatus(layoutId) {
        console.log(`🌐 GET /layout/seat-status?layoutid=${layoutId}`);
        if (!layoutId) {
            throw new common_1.BadRequestException('layoutid query parameter is required');
        }
        return this.layoutService.getLayoutSeatStatus(layoutId);
    }
    async reserveSeat(layoutId, seatId, reserveSeatDto) {
        console.log(`🌐 POST /layout/seat-status?layoutId=${layoutId}&seatId=${seatId}`);
        if (!layoutId || !seatId) {
            throw new common_1.BadRequestException('layoutId and seatId query parameters are required');
        }
        const seats = await this.layoutService.getLayoutSeats(layoutId);
        const seat = seats.find((s) => s.id === seatId);
        if (!seat) {
            throw new common_1.BadRequestException(`Seat with ID ${seatId} not found in layout ${layoutId}`);
        }
        const success = await this.mqttService.sendTemporaryReservation(seat.moduleId, reserveSeatDto.minutes);
        if (!success) {
            throw new common_1.BadRequestException('Failed to send reservation command to module');
        }
        return {
            success: true,
            message: `Temporary reservation sent to seat ${seat.seatName}`,
            reservationMinutes: reserveSeatDto.minutes || 2,
        };
    }
    async createLayout(createLayoutDto) {
        console.log('🌐 POST /layout/layouts - Creating new layout');
        return this.layoutService.createLayout(createLayoutDto);
    }
    async createSeat(createSeatDto) {
        console.log('🌐 POST /layout/seats - Creating new seat');
        return this.layoutService.createSeat(createSeatDto);
    }
    async getUnassignedModules() {
        console.log('🌐 GET /layout/modules/unassigned - Fetching unassigned modules');
        return this.layoutService.getUnassignedModules();
    }
    async assignModuleToSeat(seatId, moduleId) {
        console.log(`🌐 POST /layout/seats/${seatId}/assign-module/${moduleId}`);
        return this.layoutService.assignModuleToSeat(seatId, moduleId);
    }
    async refreshModuleStatus(moduleId) {
        console.log(`🌐 POST /layout/modules/${moduleId}/refresh`);
        const success = await this.mqttService.requestStatusRefresh(moduleId);
        if (!success) {
            throw new common_1.BadRequestException('Failed to send refresh command to module');
        }
        return {
            success: true,
            message: `Status refresh request sent to module ${moduleId}`,
        };
    }
};
exports.LayoutController = LayoutController;
__decorate([
    (0, common_1.Get)('init'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LayoutController.prototype, "getInitialLayouts", null);
__decorate([
    (0, common_1.Get)('seats'),
    __param(0, (0, common_1.Query)('layoutid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LayoutController.prototype, "getLayoutSeats", null);
__decorate([
    (0, common_1.Get)('seat-status'),
    __param(0, (0, common_1.Query)('layoutid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LayoutController.prototype, "getLayoutSeatStatus", null);
__decorate([
    (0, common_1.Post)('seat-status'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)('layoutId')),
    __param(1, (0, common_1.Query)('seatId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, layout_dto_1.ReserveSeatDto]),
    __metadata("design:returntype", Promise)
], LayoutController.prototype, "reserveSeat", null);
__decorate([
    (0, common_1.Post)('layouts'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [layout_dto_1.CreateLayoutDto]),
    __metadata("design:returntype", Promise)
], LayoutController.prototype, "createLayout", null);
__decorate([
    (0, common_1.Post)('seats'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [layout_dto_1.CreateSeatDto]),
    __metadata("design:returntype", Promise)
], LayoutController.prototype, "createSeat", null);
__decorate([
    (0, common_1.Get)('modules/unassigned'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LayoutController.prototype, "getUnassignedModules", null);
__decorate([
    (0, common_1.Post)('seats/:seatId/assign-module/:moduleId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('seatId')),
    __param(1, (0, common_1.Param)('moduleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], LayoutController.prototype, "assignModuleToSeat", null);
__decorate([
    (0, common_1.Post)('modules/:moduleId/refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('moduleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LayoutController.prototype, "refreshModuleStatus", null);
exports.LayoutController = LayoutController = __decorate([
    (0, common_1.Controller)('layout'),
    __metadata("design:paramtypes", [layout_service_1.LayoutService,
        mqtt_service_1.MqttService])
], LayoutController);
//# sourceMappingURL=layout.controller.js.map
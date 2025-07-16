"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtobufService = void 0;
const common_1 = require("@nestjs/common");
const protobuf = require("protobufjs");
let ProtobufService = class ProtobufService {
    meshPacketType;
    seatStatusType;
    deviceMetricsType;
    async onModuleInit() {
        await this.loadProtobufDefinitions();
    }
    async loadProtobufDefinitions() {
        try {
            const meshPacketProto = `
        syntax = "proto3";
        
        message MeshPacket {
          fixed32 from = 1;
          fixed32 to = 2;
          uint32 channel = 3;
          oneof payload_variant {
            Data decoded = 4;
            bytes encrypted = 5;
          }
          fixed32 id = 6;
          fixed32 rx_time = 7;
          float rx_snr = 8;
          uint32 hop_limit = 9;
          bool want_ack = 10;
          Priority priority = 11;
          int32 rx_rssi = 12;
          bool via_mqtt = 14;
          uint32 hop_start = 15;
          bytes public_key = 16;
          bool pki_encrypted = 17;
          
          enum Priority {
            UNSET = 0;
            MIN = 1;
            BACKGROUND = 10;
            DEFAULT = 64;
            RELIABLE = 70;
            ACK = 120;
            MAX = 127;
          }
        }
        
        message Data {
          uint32 portnum = 1;
          bytes payload = 2;
          bool want_response = 3;
          fixed32 dest = 4;
          fixed32 source = 5;
          fixed32 request_id = 6;
          fixed32 reply_id = 7;
          fixed32 emoji = 8;
        }
      `;
            const seatStatusProto = `
        syntax = "proto3";
        
        message SeatStatus {
          optional bool isOccupied = 1;
        }
      `;
            const deviceMetricsProto = `
        syntax = "proto3";
        
        message DeviceMetrics {
          optional uint32 battery_level = 1;
          optional float voltage = 2;
          optional float channel_utilization = 3;
          optional float air_util_tx = 4;
          optional uint32 uptime_seconds = 5;
        }
      `;
            const meshRoot = protobuf.parse(meshPacketProto).root;
            const seatRoot = protobuf.parse(seatStatusProto).root;
            const metricsRoot = protobuf.parse(deviceMetricsProto).root;
            this.meshPacketType = meshRoot.lookupType('MeshPacket');
            this.seatStatusType = seatRoot.lookupType('SeatStatus');
            this.deviceMetricsType = metricsRoot.lookupType('DeviceMetrics');
            console.log('🔧 Protobuf definitions loaded successfully');
        }
        catch (error) {
            console.error('❌ Failed to load protobuf definitions:', error);
            throw error;
        }
    }
    decodeMeshPacket(buffer) {
        try {
            const message = this.meshPacketType.decode(buffer);
            return this.meshPacketType.toObject(message);
        }
        catch (error) {
            console.error('❌ Failed to decode MeshPacket:', error);
            return null;
        }
    }
    decodeSeatStatus(buffer) {
        try {
            const message = this.seatStatusType.decode(buffer);
            return this.seatStatusType.toObject(message);
        }
        catch (error) {
            console.error('❌ Failed to decode SeatStatus:', error);
            return null;
        }
    }
    decodeDeviceMetrics(buffer) {
        try {
            const message = this.deviceMetricsType.decode(buffer);
            return this.deviceMetricsType.toObject(message);
        }
        catch (error) {
            console.error('❌ Failed to decode DeviceMetrics:', error);
            return null;
        }
    }
    encodeSeatStatus(seatStatus) {
        try {
            const message = this.seatStatusType.create(seatStatus);
            return Buffer.from(this.seatStatusType.encode(message).finish());
        }
        catch (error) {
            console.error('❌ Failed to encode SeatStatus:', error);
            throw error;
        }
    }
    encodeMeshPacket(meshPacket) {
        try {
            const message = this.meshPacketType.create(meshPacket);
            return Buffer.from(this.meshPacketType.encode(message).finish());
        }
        catch (error) {
            console.error('❌ Failed to encode MeshPacket:', error);
            throw error;
        }
    }
};
exports.ProtobufService = ProtobufService;
exports.ProtobufService = ProtobufService = __decorate([
    (0, common_1.Injectable)()
], ProtobufService);
//# sourceMappingURL=protobuf.service.js.map
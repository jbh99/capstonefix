import { OnModuleInit } from '@nestjs/common';
import { MeshPacket, SeatStatus, DeviceMetrics } from '../interfaces/protobuf.types';
export declare class ProtobufService implements OnModuleInit {
    private meshPacketType;
    private seatStatusType;
    private deviceMetricsType;
    onModuleInit(): Promise<void>;
    private loadProtobufDefinitions;
    decodeMeshPacket(buffer: Buffer): MeshPacket | null;
    decodeSeatStatus(buffer: Buffer): SeatStatus | null;
    decodeDeviceMetrics(buffer: Buffer): DeviceMetrics | null;
    encodeSeatStatus(seatStatus: SeatStatus): Buffer;
    encodeMeshPacket(meshPacket: Partial<MeshPacket>): Buffer;
}

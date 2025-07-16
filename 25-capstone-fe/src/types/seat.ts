
export interface SeatLayout {
  id: string;
  name: string;
  location: string;
  canvasSize: string;
  createdAt: string;
  updatedAt: string;
  seats: Seat[];
}

export interface Seat {
  id: string;
  seatName: string;
  seatX: number;
  seatY: number;
  layoutId: string;
  moduleId: number;
  createdAt: string;
  updatedAt: string;
  module: UnassignedModule;
  layout: SeatLayout;
}

export interface UnassignedModule {
  id: number;
  occupied: boolean;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
}

export interface SeatStatus {
  seatId: string;
  seatName: string;
  moduleId: number;
  occupied: boolean;
  lastUpdated: string;
}

export interface LayoutStatus {
  layoutId: string;
  seats: SeatStatus[];
  timestamp: string;
}

export interface SeatStatusUpdate {
  seatId: string;
  moduleId: number;
  occupied: boolean;
  timestamp: string;
}

export interface ModuleStatusUpdate {
  moduleId: number;
  batteryLevel?: number;
  voltage?: number;
  uptimeSec?: number;
  lastSeen: string;
}

export interface CreateLayoutDto {
  name: string;
  location?: string;
  canvasSize: string;
}

export interface CreateSeatDto {
  seatName: string;
  seatX: number;
  seatY: number;
  layoutId: string;
  moduleId: number;
}

export interface ReserveSeatDto {
  minutes?: number;
}

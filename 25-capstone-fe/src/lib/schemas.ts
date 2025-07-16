// src/lib/validators.ts
import { z } from "zod";

// Unassigned Module Schema
export const unassignedModuleSchema = z.object({
  id: z.number(),
  occupied: z.boolean(),
  lastUpdated: z.string().datetime(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Seat Schema
export const seatSchema = z.object({
  id: z.string(),
  seatName: z.string(),
  seatX: z.number(),
  seatY: z.number(),
  layoutId: z.string(),
  moduleId: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  module: unassignedModuleSchema,
});

// Seat Layout Schema
export const seatLayoutSchema = z.object({
  id: z.string(),
  name: z.string(),
  location: z.string(),
  canvasSize: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  seats: z.array(seatSchema),
});

// Seat Status Schema
export const seatStatusSchema = z.object({
  seatId: z.string(),
  seatName: z.string(),
  moduleId: z.number(),
  occupied: z.boolean(),
  lastUpdated: z.string().datetime(),
});

// Layout Status Schema
export const layoutStatusSchema = z.object({
  layoutId: z.string(),
  seats: z.array(seatStatusSchema),
  timestamp: z.string().datetime(),
});

// Seat Status Update Schema
export const seatStatusUpdateSchema = z.object({
  seatId: z.string(),
  moduleId: z.number(),
  occupied: z.boolean(),
  timestamp: z.string().datetime(),
});

// Module Status Update Schema
export const moduleStatusUpdateSchema = z.object({
  moduleId: z.number(),
  batteryLevel: z.number().optional(),
  voltage: z.number().optional(),
  uptimeSec: z.number().optional(),
  lastSeen: z.string().datetime(),
});

// Create Layout DTO Schema
export const createLayoutDtoSchema = z.object({
  name: z.string(),
  location: z.string().optional(),
  canvasSize: z.string(),
});

// Create Seat DTO Schema
export const createSeatDtoSchema = z.object({
  seatName: z.string(),
  seatX: z.number(),
  seatY: z.number(),
  layoutId: z.string(),
  moduleId: z.number(),
});

// Reserve Seat DTO Schema
export const reserveSeatDtoSchema = z.object({
  minutes: z.number().optional(),
});

// Type inference helpers
export type SeatLayout = z.infer<typeof seatLayoutSchema>;
export type Seat = z.infer<typeof seatSchema>;
export type UnassignedModule = z.infer<typeof unassignedModuleSchema>;
export type SeatStatus = z.infer<typeof seatStatusSchema>;
export type LayoutStatus = z.infer<typeof layoutStatusSchema>;
export type SeatStatusUpdate = z.infer<typeof seatStatusUpdateSchema>;
export type ModuleStatusUpdate = z.infer<typeof moduleStatusUpdateSchema>;
export type CreateLayoutDto = z.infer<typeof createLayoutDtoSchema>;
export type CreateSeatDto = z.infer<typeof createSeatDtoSchema>;
export type ReserveSeatDto = z.infer<typeof reserveSeatDtoSchema>;

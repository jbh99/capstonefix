import {
  SeatLayout,
  Seat,
  UnassignedModule,
  SeatStatus,
  ReserveSeatDto,
  CreateLayoutDto,
  CreateSeatDto,
} from "../types/seat";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Helper function for API requests
async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }

  return response.json();
}

// Seat API endpoints
export const seatApi = {
  // Get all seat layouts
  getLayouts: async (): Promise<SeatLayout[]> => {
    return apiRequest<SeatLayout[]>("/layout/init");
  },

  // Get seats for a specific layout
  getLayoutSeats: async (layoutId: string): Promise<Seat[]> => {
    return apiRequest<Seat[]>(`/layout/seats?layoutid=${layoutId}`);
  },

  // Get seat statuses for a specific layout
  getLayoutSeatStatus: async (layoutId: string): Promise<SeatStatus[]> => {
    return apiRequest<SeatStatus[]>(`/layout/seat-status?layoutid=${layoutId}`);
  },

  // Reserve a seat
  reserveSeat: async (
    layoutId: string,
    seatId: string,
    data: ReserveSeatDto
  ): Promise<any> => {
    return apiRequest<any>(
      `/layout/seat-status?layoutId=${layoutId}&seatId=${seatId}`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  // Create a new layout
  createLayout: async (data: CreateLayoutDto): Promise<SeatLayout> => {
    return apiRequest<SeatLayout>("/layout/layouts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Create a new seat
  createSeat: async (data: CreateSeatDto): Promise<Seat> => {
    return apiRequest<Seat>("/layout/seats", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Get unassigned modules
  getUnassignedModules: async (): Promise<UnassignedModule[]> => {
    return apiRequest<UnassignedModule[]>("/layout/modules/unassigned");
  },

  // Assign a module to a seat
  assignModuleToSeat: async (
    seatId: string,
    moduleId: number
  ): Promise<any> => {
    return apiRequest<any>(
      `/layout/seats/${seatId}/assign-module/${moduleId}`,
      {
        method: "POST",
      }
    );
  },

  // Refresh module status
  refreshModuleStatus: async (moduleId: string): Promise<any> => {
    return apiRequest<any>(`/layout/modules/${moduleId}/refresh`, {
      method: "POST",
    });
  },
};

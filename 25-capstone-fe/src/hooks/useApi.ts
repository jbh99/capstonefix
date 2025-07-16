// src/hooks/useApi.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { seatApi } from "../api/seatApi";
import {
  layoutsAtom,
  seatStatusAtom,
  selectedLayoutIdAtom,
  unassignedModulesAtom,
} from "../store/atoms"; // Assuming these atoms exist
import { CreateLayoutDto, CreateSeatDto, ReserveSeatDto } from "../types/seat";

/**
 * Fetches all layouts and syncs them with a Jotai atom.
 */
export function useGetLayouts() {
  const setLayouts = useSetAtom(layoutsAtom);
  const setLayoutId = useSetAtom(selectedLayoutIdAtom);

  const query = useQuery({
    queryKey: ["layouts"],
    queryFn: seatApi.getLayouts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (query.isSuccess) {
    setLayouts(query.data);
    setLayoutId(query.data[0].id);
  }

  return query;
}

/**
 * Fetches seat statuses for a specific layout and syncs them with a Jotai atom.
 * @param layoutId The ID of the layout to fetch statuses for.
 */
export function useGetLayoutSeatStatus(layoutId: string | null) {
  const setSeatStatuses = useSetAtom(seatStatusAtom);

  const query = useQuery({
    queryKey: ["seatStatus", layoutId],
    queryFn: () => {
      if (!layoutId) {
        return Promise.resolve([]);
      }
      return seatApi.getLayoutSeatStatus(layoutId);
    },
    enabled: !!layoutId, // Only run query if layoutId is not null
    staleTime: 30 * 1000, // 30 seconds
  });

  if (query.isSuccess) {
    setSeatStatuses(query.data);
  }

  return query;
}

/**
 * Provides a mutation function to temporarily reserve a seat.
 */
export function useReserveSeat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {
      layoutId: string;
      seatId: string;
      data: ReserveSeatDto;
    }) =>
      seatApi.reserveSeat(variables.layoutId, variables.seatId, variables.data),
    onSuccess: (_, variables) => {
      // Invalidate the seat status for the specific layout to refetch
      queryClient.invalidateQueries({
        queryKey: ["seatStatus", variables.layoutId],
      });
    },
  });
}

/**
 * Provides a mutation function to create a new layout.
 */
export function useCreateLayout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLayoutDto) => seatApi.createLayout(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["layouts"] });
    },
  });
}

/**
 * Provides a mutation function to create a new seat.
 */
export function useCreateSeat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSeatDto) => seatApi.createSeat(data),
    onSuccess: (data) => {
      // Invalidate queries for both the specific layout and all layouts
      queryClient.invalidateQueries({
        queryKey: ["seatStatus", data.layoutId],
      });
      queryClient.invalidateQueries({ queryKey: ["layouts"] });
    },
  });
}

/**
 * Fetches all unassigned modules and syncs them with a Jotai atom.
 */
export function useGetUnassignedModules() {
  const setUnassignedModules = useSetAtom(unassignedModulesAtom);

  const query = useQuery({
    queryKey: ["unassignedModules"],
    queryFn: seatApi.getUnassignedModules,
    staleTime: 60 * 1000, // 1 minute
  });

  if (query.isSuccess) {
    setUnassignedModules(query.data);
  }

  return query;
}

/**
 * Provides a mutation function to assign a hardware module to a seat.
 */
export function useAssignModuleToSeat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { seatId: string; moduleId: number }) =>
      seatApi.assignModuleToSeat(variables.seatId, variables.moduleId),
    onSuccess: () => {
      // Invalidate queries that might be affected
      queryClient.invalidateQueries({ queryKey: ["unassignedModules"] });
      queryClient.invalidateQueries({ queryKey: ["layouts"] });
    },
  });
}

/**
 * Provides a mutation function to request a status refresh from a module.
 */
export function useRefreshModuleStatus() {
  // This mutation sends a command, and the update will arrive via WebSocket.
  // No query invalidation is needed here.
  return useMutation({
    mutationFn: (moduleId: string) => seatApi.refreshModuleStatus(moduleId),
  });
}

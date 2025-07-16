// src/hooks/useWebSocket.ts
import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { websocketClient } from "../api/websocketClient";
import { seatStatusesAtom } from "../store/atoms";
import {
  layoutStatusSchema,
  seatStatusUpdateSchema,
  moduleStatusUpdateSchema,
} from "../lib/schemas"; 

export function useWebSocket(layoutId: string | null) {
  const setSeatStatuses = useSetAtom(seatStatusesAtom);

  useEffect(() => {
    if (!layoutId) {
      websocketClient.disconnect();
      return;
    }

    // Handler for the initial full layout status
    const handleLayoutStatus = (status: unknown) => {
      try {
        const parsedStatus = layoutStatusSchema.parse(status);
        setSeatStatuses(parsedStatus.seats);
      } catch (error) {
        console.error("Failed to parse layout status:", error);
      }
    };

    // Handler for individual seat updates
    const handleSeatUpdate = (update: unknown) => {
      try {
        const parsedUpdate = seatStatusUpdateSchema.parse(update);
        setSeatStatuses((prev) =>
          prev.map((seat) =>
            seat.seatId === parsedUpdate.seatId
              ? {
                  ...seat,
                  occupied: parsedUpdate.occupied,
                  lastUpdated: parsedUpdate.timestamp,
                }
              : seat
          )
        );
      } catch (error) {
        console.error("Failed to parse seat update:", error);
      }
    };

    // Handler for module status updates (e.g., battery)
    const handleModuleStatusUpdate = (update: unknown) => {
      try {
        const parsedUpdate = moduleStatusUpdateSchema.parse(update);
        // Here you would update a different atom or part of your state
        // that stores module-specific information, if you have one.
        console.log("Module status update received:", parsedUpdate);
      } catch (error) {
        console.error("Failed to parse module status update:", error);
      }
    };

    const unsubs = [
      websocketClient.onLayoutStatus(handleLayoutStatus),
      websocketClient.onSeatUpdate(handleSeatUpdate),
      websocketClient.onModuleStatusUpdate(handleModuleStatusUpdate),
    ];

    // Subscribe to the new layout
    websocketClient.subscribeToLayout(layoutId);

    // Cleanup on unmount or when layoutId changes
    return () => {
      console.log(`Unsubscribing from layout ${layoutId}`);
      websocketClient.unsubscribeFromLayout(layoutId);
      unsubs.forEach((unsub) => unsub());
    };
  }, [layoutId, setSeatStatuses]);

  // You can return connection status or other values if needed
  // For now, this hook primarily manages state updates.
}

import { useEffect } from "react";
import { io } from "socket.io-client";
import { useAtom, useSetAtom } from "jotai";
import { seatStatusAtom, selectedLayoutIdAtom } from "../store/atoms";
import { LayoutStatus } from "@/lib/schemas";

const SOCKET_URL = "http://localhost:3000"; // Adjust if your backend is on a different port

export const useWebSocket = () => {
  const [selectedLayoutId] = useAtom(selectedLayoutIdAtom);
  const setStatus = useSetAtom(seatStatusAtom);

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on("connect", () => {
      console.log("Connected to WebSocket");
      if (selectedLayoutId) {
        socket.emit("layout-status", { layoutId: selectedLayoutId });
      }
    });

    socket.on("layout-status", (data: LayoutStatus) => {
      setStatus(data.seats);
    });

    socket.on("seat-update", (data) => {
      // Update the Jotai atom with the new seat status
      setStatus((prev) =>
        prev.map((seat) =>
          seat.seatId === data.seatId ? { ...seat, ...data } : seat
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedLayoutId, setStatus]);
};

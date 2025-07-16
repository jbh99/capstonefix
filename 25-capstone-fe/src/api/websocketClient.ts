// src/api/websocketClient.ts
import { io, Socket } from "socket.io-client";
import {
  LayoutStatus,
  SeatStatusUpdate,
  ModuleStatusUpdate,
} from "../types/seat";

const WS_BASE_URL = import.meta.env.VITE_WS_URL || "http://localhost:3000";

export class WebSocketClient {
  private socket: Socket | null = null;
  private layoutStatusListeners: ((status: LayoutStatus) => void)[] = [];
  private seatUpdateListeners: ((update: SeatStatusUpdate) => void)[] = [];
  private moduleStatusUpdateListeners: ((
    update: ModuleStatusUpdate
  ) => void)[] = [];
  private connectionStateListeners: ((connected: boolean) => void)[] = [];
  private mqttConnectionStateListeners: ((connected: boolean) => void)[] = [];
  private errorListeners: ((error: any) => void)[] = [];

  constructor() {
    this.connect();
  }

  private connect() {
    try {
      this.socket = io(WS_BASE_URL, {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        autoConnect: true,
      });

      this.registerEventListeners();
    } catch (error) {
      console.error("WebSocket connection error:", error);
      this.notifyError(error);
      this.notifyConnectionState(false);
    }
  }

  private registerEventListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("WebSocket connected");
      this.notifyConnectionState(true);
    });

    this.socket.on("disconnect", () => {
      console.log("WebSocket disconnected");
      this.notifyConnectionState(false);
    });

    this.socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
      this.notifyError(error);
    });

    this.socket.on(
      "connection-status",
      (data: { connected: boolean; mqttConnected: boolean }) => {
        this.notifyConnectionState(data.connected);
        this.notifyMqttConnectionState(data.mqttConnected);
      }
    );

    this.socket.on("layout-status", (status: LayoutStatus) => {
      console.log("Received layout status:", status);
      this.notifyLayoutStatus(status);
    });

    this.socket.on("seat-update", (update: SeatStatusUpdate) => {
      console.log("Received seat update:", update);
      this.notifySeatUpdate(update);
    });

    this.socket.on("module-status-update", (update: ModuleStatusUpdate) => {
      console.log("Received module status update:", update);
      this.notifyModuleStatusUpdate(update);
    });

    this.socket.on("subscription-confirmed", (message) => {
      console.log("Subscription confirmed:", message);
    });

    this.socket.on("unsubscription-confirmed", (message) => {
      console.log("Unsubscription confirmed:", message);
    });

    this.socket.on("subscription-error", (error) => {
      console.error("WebSocket subscription error:", error);
      this.notifyError(error);
    });

    this.socket.on("pong", (data) => {
      console.log("Pong received:", data);
      this.notifyMqttConnectionState(data.mqttConnected);
    });
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public subscribeToLayout(layoutId: string) {
    if (this.socket && this.socket.connected) {
      this.socket.emit("subscribe-layout", { layoutId });
    }
  }

  public unsubscribeFromLayout(layoutId: string) {
    if (this.socket && this.socket.connected) {
      this.socket.emit("unsubscribe-layout", { layoutId });
    }
  }

  public ping() {
    if (this.socket && this.socket.connected) {
      this.socket.emit("ping");
    }
  }

  // Event listeners management
  public onLayoutStatus(listener: (status: LayoutStatus) => void): () => void {
    this.layoutStatusListeners.push(listener);
    return () => {
      this.layoutStatusListeners = this.layoutStatusListeners.filter(
        (l) => l !== listener
      );
    };
  }

  public onSeatUpdate(
    listener: (update: SeatStatusUpdate) => void
  ): () => void {
    this.seatUpdateListeners.push(listener);
    return () => {
      this.seatUpdateListeners = this.seatUpdateListeners.filter(
        (l) => l !== listener
      );
    };
  }

  public onModuleStatusUpdate(
    listener: (update: ModuleStatusUpdate) => void
  ): () => void {
    this.moduleStatusUpdateListeners.push(listener);
    return () => {
      this.moduleStatusUpdateListeners =
        this.moduleStatusUpdateListeners.filter((l) => l !== listener);
    };
  }

  public onConnectionState(listener: (connected: boolean) => void): () => void {
    this.connectionStateListeners.push(listener);
    return () => {
      this.connectionStateListeners = this.connectionStateListeners.filter(
        (l) => l !== listener
      );
    };
  }

  public onMqttConnectionState(
    listener: (connected: boolean) => void
  ): () => void {
    this.mqttConnectionStateListeners.push(listener);
    return () => {
      this.mqttConnectionStateListeners =
        this.mqttConnectionStateListeners.filter((l) => l !== listener);
    };
  }

  public onError(listener: (error: any) => void): () => void {
    this.errorListeners.push(listener);
    return () => {
      this.errorListeners = this.errorListeners.filter((l) => l !== listener);
    };
  }

  // Notification methods
  private notifyLayoutStatus(status: LayoutStatus) {
    this.layoutStatusListeners.forEach((listener) => listener(status));
  }

  private notifySeatUpdate(update: SeatStatusUpdate) {
    this.seatUpdateListeners.forEach((listener) => listener(update));
  }

  private notifyModuleStatusUpdate(update: ModuleStatusUpdate) {
    this.moduleStatusUpdateListeners.forEach((listener) => listener(update));
  }

  private notifyConnectionState(connected: boolean) {
    this.connectionStateListeners.forEach((listener) => listener(connected));
  }

  private notifyMqttConnectionState(connected: boolean) {
    this.mqttConnectionStateListeners.forEach((listener) =>
      listener(connected)
    );
  }

  private notifyError(error: any) {
    this.errorListeners.forEach((listener) => listener(error));
  }
}

// Singleton instance
export const websocketClient = new WebSocketClient();

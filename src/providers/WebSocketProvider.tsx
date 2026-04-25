import { WebSocketContext, type WebSocketContextValue } from "@/contexts/WebSocketContext";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

type WebSocketProviderProps = {
  children: ReactNode;
  url?: string;
};

export const WebSocketProvider = ({ children, url }: WebSocketProviderProps) => {
  const wsUrl = url ?? import.meta.env.VITE_WS_URL ?? "ws://localhost:8000/ws";

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<number | undefined>(undefined);
  const reconnectAttemptRef = useRef(0);

  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  useEffect(() => {
    let isDisposed = false;

    const clearReconnectTimer = () => {
      if (reconnectTimerRef.current) {
        window.clearTimeout(reconnectTimerRef.current);
      }
      reconnectTimerRef.current = undefined;
    };

    const scheduleReconnect = () => {
      if (isDisposed) return;
      clearReconnectTimer();

      const delayMs = Math.min(1000 * 2 ** reconnectAttemptRef.current, 10_000);
      reconnectAttemptRef.current += 1;
      reconnectTimerRef.current = window.setTimeout(connect, delayMs);
    };

    const connect = () => {
      if (isDisposed) return;

      try {
        socketRef.current?.close();
      } catch {
        // ignore
      }

      let socket: WebSocket;
      try {
        socket = new WebSocket(wsUrl);
      } catch {
        setIsConnected(false);
        scheduleReconnect();
        return;
      }

      socketRef.current = socket;

      socket.addEventListener("open", () => {
        if (isDisposed) return;
        reconnectAttemptRef.current = 0;
        setIsConnected(true);
      });

      socket.addEventListener("message", (event) => {
        if (isDisposed) return;
        setLastMessage(String(event.data));
      });

      socket.addEventListener("close", () => {
        if (isDisposed) return;
        setIsConnected(false);
        scheduleReconnect();
      });

      socket.addEventListener("error", () => {
        if (isDisposed) return;
        setIsConnected(false);
        try {
          socket.close();
        } catch {
          // ignore
        }
      });
    };

    connect();

    return () => {
      isDisposed = true;
      clearReconnectTimer();
      try {
        socketRef.current?.close();
      } catch {
        // ignore
      }
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [wsUrl]);

  const send = useCallback((data: string) => {
    const socket = socketRef.current;
    if (!socket) return false;
    if (socket.readyState !== WebSocket.OPEN) return false;
    socket.send(data);
    return true;
  }, []);

  const value = useMemo<WebSocketContextValue>(() => {
    return {
      isConnected,
      lastMessage,
      send,
    };
  }, [isConnected, lastMessage, send]);

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
};

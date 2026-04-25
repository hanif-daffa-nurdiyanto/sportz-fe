import { createContext } from "react";

export type WebSocketContextValue = {
  isConnected: boolean;
  lastMessage: string | null;
  send: (data: string) => boolean;
};

export const WebSocketContext = createContext<WebSocketContextValue | null>(null);

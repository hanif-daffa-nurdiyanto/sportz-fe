import { WebSocketContext } from "@/contexts/WebSocketContext";
import { useContext } from "react";

export const useWebSocket = () => {
  const value = useContext(WebSocketContext);
  if (!value) {
    throw new Error("useWebSocket must be used within WebSocketProvider");
  }
  return value;
};


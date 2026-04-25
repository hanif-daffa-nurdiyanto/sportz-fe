import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useWebSocket } from "@/hooks/useWebSocket";
import type { Match } from "./matches.api";
import { toast } from "sonner";

type WsMessage = {
  type: string;
  data?: unknown;
  [key: string]: unknown;
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const isMatch = (value: unknown): value is Match => {
  if (!isRecord(value)) return false;
  return typeof value.id === "number";
};

const isMatchCreatedMessage = (
  value: unknown,
): value is { type: "matchCreated"; data: Match } => {
  if (!isRecord(value)) return false;
  if (value.type !== "matchCreated") return false;
  return isMatch(value.data);
};

export function useLiveMatchCreated() {
  const { lastMessage } = useWebSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!lastMessage) return;

    let msg: WsMessage;
    try {
      msg = JSON.parse(lastMessage);
    } catch {
      return;
    }

    if (!isMatchCreatedMessage(msg)) return;

    const prev = queryClient.getQueryData<Match[]>(["matches"]) ?? [];
    const isNew = !prev.some((m) => m.id === msg.data.id);

    if (isNew)
      toast(`New match created: ${msg.data.homeTeam} vs ${msg.data.awayTeam}`);

    queryClient.setQueryData<Match[]>(["matches"], (old) => {
      const current = old ?? [];
      const incoming = msg.data;
      const exists = current.some((m) => m.id === incoming.id);
      if (exists) {
        return current.map((m) => (m.id === incoming.id ? incoming : m));
      }
      return [incoming, ...current];
    });
  }, [lastMessage, queryClient]);
}

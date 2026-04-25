import { useEffect } from "react";
import type { CommentaryEntry } from "./commentary.api";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useQueryClient } from "@tanstack/react-query";

type WsMessage = {
  type: string;
  data?: unknown;
  [key: string]: unknown;
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const isCommentaryEntry = (value: unknown): value is CommentaryEntry => {
  if (!isRecord(value)) return false;
  return typeof value.id === "number" && typeof value.matchId === "number";
};

const isCommentaryMessage = (
  value: unknown,
): value is { type: "commentary"; data: CommentaryEntry } => {
  if (!isRecord(value)) return false;
  if (value.type !== "commentary") return false;
  return isCommentaryEntry(value.data);
};

export const useLiveCommentary = (activeMatchId: number | null) => {
  const { lastMessage } = useWebSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (activeMatchId === null) return;
    if (!lastMessage) return;

    let msg: WsMessage;
    try {
      msg = JSON.parse(lastMessage);
    } catch {
      return;
    }

    if (!isCommentaryMessage(msg)) return;

    const incoming = msg.data;
    if (incoming.matchId !== activeMatchId) return;

    queryClient.setQueryData<CommentaryEntry[]>(
      ["commentary", activeMatchId],
      (old) => {
        const current = old ?? [];
        const exists = current.some((c) => c.id === incoming.id);
        if (exists) return current;
        return [incoming, ...current];
      },
    );
  }, [lastMessage, activeMatchId, queryClient]);
};

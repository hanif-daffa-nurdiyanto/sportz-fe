import { apiGet, apiPost } from "@/lib/api";

export type CommentaryEntry = {
  id: number;
  matchId: number;
  minute: number | null;
  sequence: number;
  period: string | null;
  eventType: string;
  actor: string | null;
  team: string | null;
  message: string;
  metadata: unknown;
  tags: string[] | null;
  createdAt: string;
};

type CommentaryResponse = {
  data: CommentaryEntry[];
};

export async function getCommentary(matchId: number, limit = 100) {
  const { data } = await apiGet<CommentaryResponse>(
    `/matches/${matchId}/commentary?limit=${limit}`,
  );
  return data;
}

export type CreateCommentaryInput = {
  minute?: number;
  sequence: number;
  period?: string;
  eventType: string;
  actor?: string;
  team?: string;
  message: string;
  metadata?: Record<string, unknown>;
  tags?: string[];
};

type CreateCommentaryResponse = {
  data: CommentaryEntry;
};

export async function createCommentary(
  matchId: number,
  payload: CreateCommentaryInput,
) {
  const { data } = await apiPost<CreateCommentaryResponse>(
    `/matches/${matchId}/commentary`,
    payload,
  );
  return data;
}

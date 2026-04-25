import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCommentary,
  type CommentaryEntry,
  type CreateCommentaryInput,
} from "./commentary.api";

export function useCreateCommentary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      matchId,
      payload,
    }: {
      matchId: number;
      payload: CreateCommentaryInput;
    }) => createCommentary(matchId, payload),
    onSuccess: (created, variables) => {
      queryClient.setQueryData<CommentaryEntry[]>(
        ["commentary", variables.matchId],
        (old) => {
          const current = old ?? [];
          if (current.some((c) => c.id === created.id)) return current;
          return [created, ...current];
        },
      );
    },
  });
}


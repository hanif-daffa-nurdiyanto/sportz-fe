import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMatch, type CreateMatchInput, type Match } from "./matches.api";
import { toast } from "sonner";

export const useCreateMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMatchInput) => createMatch(payload),
    onSuccess: (created: Match) => {
      toast(`New match created: ${created.homeTeam} vs ${created.awayTeam}`);

      queryClient.invalidateQueries({ queryKey: ["matches"] });
      queryClient.setQueryData<Match[]>(["matches"], (old) => {
        const current = old ?? [];
        if (current.some((m) => m.id === created.id)) return current;
        return [created, ...current];
      });
    },
    onError: () => {
      toast.error("Failed to create match");
    },
  });
};

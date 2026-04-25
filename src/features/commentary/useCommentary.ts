import { useQuery } from "@tanstack/react-query";
import { getCommentary } from "./commentary.api";

export function useCommentary(matchId: number | null) {
  return useQuery({
    queryKey: ["commentary", matchId],
    queryFn: () => getCommentary(matchId as number),
    enabled: matchId !== null,
  });
}


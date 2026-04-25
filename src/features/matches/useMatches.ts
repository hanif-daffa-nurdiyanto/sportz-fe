import { useQuery } from "@tanstack/react-query";
import { getMatches } from "./matches.api";

export const useMatches = () => {
  return useQuery({
    queryKey: ["matches"],
    queryFn: getMatches,
  });
};

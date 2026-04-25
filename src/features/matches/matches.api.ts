import { apiGet, apiPost } from "@/lib/api";

export type Match = {
  id: number;
  sport: string;
  homeTeam: string;
  awayTeam: string;
  status: string;
  startTime: string;
  endTime: string;
  homeScore: number;
  awayScore: number;
};

export type MatchResponse = {
  data: Match[];
};

export type CreateMatchInput = {
  sport: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  endTime: string;
  homeScore?: number;
  awayScore?: number;
}

export type CreateMatchResponse = {
  data: Match;
};

export const getMatches = async () => {
  const { data } = await apiGet<MatchResponse>("/matches");
  return data;
};

export const createMatch = async (payload: CreateMatchInput) => {
  const { data } = await apiPost<CreateMatchResponse>("/matches", payload);
  return data;
};



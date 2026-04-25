import { useState } from "react";
import { useCreateMatch } from "@/features/matches/useCreateMatch";

export const Admin = () => {
  const createMatch = useCreateMatch();

  const [sport, setSport] = useState("football");
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [startLocal, setStartLocal] = useState("");
  const [endLocal, setEndLocal] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!sport || !homeTeam || !awayTeam || !startLocal || !endLocal) return;

    const startTime = new Date(startLocal).toISOString();
    const endTime = new Date(endLocal).toISOString();

    createMatch.mutate({
      sport,
      homeTeam,
      awayTeam,
      startTime,
      endTime,
    });
  };

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <h1 className="text-xl font-bold">Admin - Create Match</h1>

      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block">
          <div className="text-sm font-semibold">Sport</div>
          <input
            className="border-2 border-black rounded px-3 py-2 w-full"
            value={sport}
            onChange={(e) => setSport(e.target.value)}
          />
        </label>

        <label className="block">
          <div className="text-sm font-semibold">Home Team</div>
          <input
            className="border-2 border-black rounded px-3 py-2 w-full"
            value={homeTeam}
            onChange={(e) => setHomeTeam(e.target.value)}
          />
        </label>

        <label className="block">
          <div className="text-sm font-semibold">Away Team</div>
          <input
            className="border-2 border-black rounded px-3 py-2 w-full"
            value={awayTeam}
            onChange={(e) => setAwayTeam(e.target.value)}
          />
        </label>

        <label className="block">
          <div className="text-sm font-semibold">Start Time</div>
          <input
            className="border-2 border-black rounded px-3 py-2 w-full"
            type="datetime-local"
            value={startLocal}
            onChange={(e) => setStartLocal(e.target.value)}
          />
        </label>

        <label className="block">
          <div className="text-sm font-semibold">End Time</div>
          <input
            className="border-2 border-black rounded px-3 py-2 w-full"
            type="datetime-local"
            value={endLocal}
            onChange={(e) => setEndLocal(e.target.value)}
          />
        </label>

        <button
          type="submit"
          disabled={createMatch.isPending}
          className="border-2 border-black rounded px-3 py-2 bg-yellow-300 font-semibold disabled:opacity-50"
        >
          {createMatch.isPending ? "Creating..." : "Create Match"}
        </button>
      </form>
    </div>
  );
};

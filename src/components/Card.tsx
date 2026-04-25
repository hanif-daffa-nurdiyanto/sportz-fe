import type { Match } from "@/features/matches/matches.api";
import { cn } from "@/lib/utils";

interface CardProps {
  match: Match;
  isWatched: boolean;
  onToggleWatch: () => void;
  disabled?: boolean;
}

const Card = ({ match, isWatched, onToggleWatch, disabled }: CardProps) => {
  return (
    <div className="border-2 rounded-2xl px-4 py-4 border-black">
      <div className="flex justify-between">
        <h4 className="uppercase font-semibold border-2 border-slate-500 rounded-2xl px-2 text-slate-500 text-xs">
          {match.sport}
        </h4>
        <div className="flex items-center gap-1">
          <span
            className={cn(
              "rounded-full w-3 h-3 border",
              match.status === "live"
                ? "bg-red-500"
                : match.status === "finished"
                  ? "bg-green-500"
                  : "bg-slate-500",
            )}
          />
          <p className="capitalize font-semibold text-xs">{match.status}</p>
        </div>
      </div>

      <div className="my-7">
        <div className="flex justify-between">
          <h5 className="capitalize font-semibold text-lg">{match.homeTeam}</h5>
          <p className="font-semibold border-2 px-3 rounded bg-slate-300">
            {match.homeScore}
          </p>
        </div>

        <div className="flex justify-between mt-2">
          <h5 className="capitalize font-semibold text-lg">{match.awayTeam}</h5>
          <p className="font-semibold border-2 px-3 rounded bg-slate-300">
            {match.awayScore}
          </p>
        </div>
      </div>

      <div className="border-t-2 border-t-slate-300 border-dashed flex justify-between pt-3 items-center">
        <h5 className="capitalize font-semibold text-sm text-slate-700">
          {new Date(match.startTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          -{" "}
          {new Date(match.endTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </h5>
        <div>
          <button
            onClick={onToggleWatch}
            disabled={disabled}
            className="font-semibold border-2 border-slate-700 px-3 rounded-full py-1 bg-yellow-300 capitalize cursor-pointer"
          >
            {isWatched ? "close" : "watch live"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;

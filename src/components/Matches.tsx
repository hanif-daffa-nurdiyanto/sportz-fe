import { useMatches } from "@/features/matches/useMatches";
import Card from "./Card";
import Loader from "./Loader";

type MatchesProps = {
  activeMatchId: number | null;
  onToggleWatch: (matchId: number) => void;
  isWsConnected: boolean;
};

const Matches = ({
  activeMatchId,
  onToggleWatch,
  isWsConnected,
}: MatchesProps) => {
  const { data, isLoading, error } = useMatches();

  if (isLoading)
    return (
      <div className="text-center flex items-center gap-2 mt-4">
        <Loader /> Load matches
      </div>
    );
  if (error)
    return (
      <div className="text-center flex items-center gap-2 mt-4">
        {error.message}
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-5">
      {data?.map((match) => (
        <Card
          key={match.id}
          match={match}
          isWatched={match.id === activeMatchId}
          onToggleWatch={() => onToggleWatch(match.id)}
          disabled={!isWsConnected}
        />
      ))}
    </div>
  );
};

export default Matches;

import { cn } from "@/lib/utils";
import Comment from "./Comment";
import { useCommentary } from "@/features/commentary/useCommentary";
import Loader from "./Loader";
import InputComment from "./InputComment";

type LiveCommentaryProps = {
  className?: string;
  listClassName?: string;
  onClose?: () => void;
  matchId?: number | null;
};

const LiveCommentary = ({
  className,
  listClassName,
  onClose,
  matchId = null,
}: LiveCommentaryProps) => {
  const { data, isLoading, error } = useCommentary(matchId);

  return (
    <section
      className={cn(
        "rounded-2xl flex flex-col overflow-hidden border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white relative h-[calc(100vh-32px)]",
        className,
      )}
    >
      <div className="bg-blue-300 flex px-5 py-4 border-b-2 border-b-black items-center gap-2">
        <h3 className="font-bold capitalize flex-1">live commentary</h3>
        <p className="text-sm border-2 border-slate-700 rounded-md px-2 bg-slate-100">
          Real-time
        </p>
        {onClose && (
          <button
            type="button"
            className="border-2 border-black bg-white/80 hover:bg-white rounded-md px-2 py-1 text-sm"
            onClick={onClose}
            aria-label="Close live commentary"
          >
            <span aria-hidden>×</span>
          </button>
        )}
      </div>

      <div className={cn("overflow-y-scroll flex-1 px-2 py-4", listClassName)}>
        {matchId === null ? (
          <p className="text-sm text-slate-600 px-3">
            Select match and then click{" "}
            <span className="font-semibold">watch live</span> to see live
            commentary
          </p>
        ) : isLoading ? (
          <div className="flex items-center gap-2 px-3">
            <Loader /> Load commentary
          </div>
        ) : error ? (
          <p className="text-sm text-red-600 px-3">{error.message}</p>
        ) : data && data.length > 0 ? (
          data.map((entry) => <Comment key={entry.id} entry={entry} />)
        ) : (
          <p className="text-sm text-slate-600 px-3">No commentary</p>
        )}
      </div>

      <InputComment matchId={matchId} />
    </section>
  );
};

export default LiveCommentary;

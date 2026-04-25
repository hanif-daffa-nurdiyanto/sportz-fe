import Header from "@/components/Header";
import LiveCommentary from "@/components/LiveCommentary";
import Loader from "@/components/Loader";
import Matches from "@/components/Matches";
import { useLiveCommentary } from "@/features/commentary/useLiveCommentary";
import { useLiveMatchCreated } from "@/features/matches/useLiveMatchCreated";
import { useMatches } from "@/features/matches/useMatches";
import { useWatchLiveMatch } from "@/features/matches/useWatchLiveMatch";
import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

export const Home = () => {
  const [isCommentaryOpen, setIsCommentaryOpen] = useState(false);
  const { data, isLoading } = useMatches();

  useLiveMatchCreated();
  const { activeMatchId, toggleWatch, isConnected } = useWatchLiveMatch();
  useLiveCommentary(activeMatchId);

  useEffect(() => {
    if (!isCommentaryOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isCommentaryOpen]);

  useEffect(() => {
    if (!isCommentaryOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsCommentaryOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isCommentaryOpen]);

  useEffect(() => {
    if (!isCommentaryOpen) return;

    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (mediaQuery.matches) setIsCommentaryOpen(false);
    };

    onChange();
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, [isCommentaryOpen]);

  return (
    <div>
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-10">
        <main className="md:col-span-2 space-y-4">
          <section className="pt-2 rounded-2xl ">
            <div className="flex">
              <h3 className="font-bold capitalize border-l-5 pl-4 border-blue-300 flex-1">
                Current Match
              </h3>
              <div></div>
              <span className="bg-slate-900 rounded text-slate-200 px-2 inline-flex items-center gap-1 text-sm">
                Live:
                {isLoading ? (
                  <Loader className="w-4 h-4" />
                ) : (
                  <span>{data?.length}</span>
                )}
              </span>
            </div>
            <Matches
              activeMatchId={activeMatchId}
              onToggleWatch={toggleWatch}
              isWsConnected={isConnected}
            />
          </section>
        </main>
        <aside className="hidden md:block md:col-span-1">
          <LiveCommentary className="sticky top-4" matchId={activeMatchId} />
        </aside>
      </div>

      <button
        type="button"
        className="md:hidden fixed bottom-6 right-6 z-40 rounded-full border-2 border-black bg-blue-300  p-3 font-semibold"
        onClick={() => setIsCommentaryOpen(true)}
      >
        <MessageCircle className="" />
      </button>

      {isCommentaryOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close live commentary"
            onClick={() => setIsCommentaryOpen(false)}
          />
          <div className="absolute bottom-2 left-8 right-7 mx-auto">
            <LiveCommentary
              onClose={() => setIsCommentaryOpen(false)}
              listClassName="h-auto max-h-[70vh] overflow-y-auto"
              matchId={activeMatchId}
            />
          </div>
        </div>
      )}
    </div>
  );
};


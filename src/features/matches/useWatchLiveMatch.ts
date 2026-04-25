import { useCallback, useEffect, useRef, useState } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";

export function useWatchLiveMatch() {
  const { send, isConnected } = useWebSocket();
  const [activeMatchId, setActiveMatchId] = useState<number | null>(null);
  const subscribedMatchIdRef = useRef<number | null>(null);

  const subscribe = useCallback((matchId: number) => {
    return send(JSON.stringify({ type: "subscribe", matchId }));
  }, [send]);

  const unsubscribe = useCallback((matchId: number) => {
    return send(JSON.stringify({ type: "unsubscribe", matchId }));
  }, [send]);

  const toggleWatch = useCallback((matchId: number) => {
    setActiveMatchId((prev) => {
      if (prev === matchId) {
        return null;
      }
      return matchId;
    });
  }, []);

  useEffect(() => {
    return () => {
      if (!isConnected) return;
      if (activeMatchId !== null) unsubscribe(activeMatchId);
    };
  }, [activeMatchId, isConnected, unsubscribe]);

  useEffect(() => {
    if (!isConnected) {
      subscribedMatchIdRef.current = null;
      return;
    }

    const currentSubscribed = subscribedMatchIdRef.current;

    if (activeMatchId === null) {
      if (currentSubscribed !== null) {
        unsubscribe(currentSubscribed);
        subscribedMatchIdRef.current = null;
      }
      return;
    }

    if (currentSubscribed === activeMatchId) return;

    if (currentSubscribed !== null) {
      unsubscribe(currentSubscribed);
    }

    const ok = subscribe(activeMatchId);
    if (ok) subscribedMatchIdRef.current = activeMatchId;
  }, [activeMatchId, isConnected, subscribe, unsubscribe]);

  return { activeMatchId, toggleWatch, isConnected };
}

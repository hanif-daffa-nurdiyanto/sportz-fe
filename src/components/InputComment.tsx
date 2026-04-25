import { ChevronDown, Send } from "lucide-react";
import { useState } from "react";
import { useCreateCommentary } from "@/features/commentary/useCreateCommentary";
import { useQueryClient } from "@tanstack/react-query";
import type { CommentaryEntry } from "@/features/commentary/commentary.api";

type InputCommentProps = {
  matchId: number | null;
};

const InputComment = ({ matchId }: InputCommentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [eventType, setEventType] = useState("");
  const [actorOrTeam, setActorOrTeam] = useState("");
  const [message, setMessage] = useState("");

  const createCommentary = useCreateCommentary();
  const queryClient = useQueryClient();

  const isDisabled = matchId === null || createCommentary.isPending;

  const submit = () => {
    if (matchId === null) return;
    if (!eventType.trim() || !message.trim()) return;

    const existing =
      queryClient.getQueryData<CommentaryEntry[]>(["commentary", matchId]) ?? [];
    const maxSequence = existing.reduce((max, entry) => {
      return entry.sequence > max ? entry.sequence : max;
    }, 0);
    const sequence = maxSequence + 1;

    createCommentary.mutate(
      {
        matchId,
        payload: {
          sequence,
          eventType: eventType.trim(),
          actor: actorOrTeam.trim() || undefined,
          message: message.trim(),
        },
      },
      {
        onSuccess: () => {
          setEventType("");
          setActorOrTeam("");
          setMessage("");
          setIsOpen(false);
        },
      },
    );
  };

  return (
    <div className="bg-blue-300 px-3 pb-4 pt-2 flex gap-2 border-t-2 border-t-slate-700 flex-col w-full">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={matchId === null}
        className="w-full flex justify-between items-center"
      >
        <p>Comment</p>
        {isOpen ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4 rotate-180" />
        )}
      </button>
      {isOpen && (
        <>
          <input
            type="text"
            className="rounded px-3 w-full py-2 ring-1 outline-0 flex-1 bg-slate-100"
            placeholder="Event type (e.g. Goal, Foul)"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
          />
          <input
            type="text"
            className="rounded px-3 w-full py-2 ring-1 outline-0 flex-1 bg-slate-100"
            placeholder="Actor / Team (optional)"
            value={actorOrTeam}
            onChange={(e) => setActorOrTeam(e.target.value)}
          />
          <input
            type="text"
            className="rounded px-3 w-full py-2 ring-1 outline-0 flex-1 bg-slate-100"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="button"
            disabled={isDisabled}
            onClick={submit}
            className="mt-5 border-2 w-full flex items-center justify-center border-slate-700 rounded-3xl px-4 py-2 bg-yellow-300 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
          {createCommentary.isError && (
            <p className="text-sm text-red-700">{createCommentary.error.message}</p>
          )}
        </>
      )}
    </div>
  );
};

export default InputComment;

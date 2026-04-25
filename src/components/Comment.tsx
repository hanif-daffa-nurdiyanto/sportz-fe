import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import type { CommentaryEntry } from "@/features/commentary/commentary.api";

type CommentProps = {
  entry: CommentaryEntry;
};

const Comment = ({ entry }: CommentProps) => {
  const createdTime = new Date(entry.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="flex gap-2 pr-2">
      <div className="flex flex-col gap-2 items-center pt-2">
        <div className="border border-slate-700 w-2 h-2 bg-yellow-300 rounded-full" />
        <div className="h-full flex-1 bg-slate-700 w-0.5 rounded-full" />
      </div>
      <div className="flex-1">
        <div className="flex gap-2 items-center mb-2 w-full overflow-x-auto flex-wrap">
          <p className="text-slate-700 text-xs">{createdTime}</p>
          {entry.minute !== null && <Label>{entry.minute}'</Label>}
          <Label>Seq {entry.sequence}</Label>
          {entry.period && <Label>{entry.period}</Label>}
          <Label main>{entry.eventType}</Label>
        </div>
        {(entry.actor || entry.team) && (
          <p>{[entry.actor, entry.team].filter(Boolean).join(" - ")}</p>
        )}
        <p className="bg-slate-200 rounded-xl rounded-tl-none border-2 border-[#c4c4c442] px-2 py-4 my-2">
          {entry.message}
        </p>
        {entry.tags?.[0] && (
          <button className="mb-3 rounded-full border-2 border-[#c4c4c442] text-slate-400 px-2 text-sm">
            {entry.tags[0]}
          </button>
        )}
      </div>
    </div>
  );
};

const Label = ({
  children,
  main = false,
}: {
  children: ReactNode;
  main?: boolean;
}) => {
  return (
    <p
      className={cn(
        "bg-slate-200 rounded-full border-2 border-[#c4c4c442] text-xs px-1 py-0.5",
        main && "bg-yellow-300 border-black",
      )}
    >
      {children}
    </p>
  );
};

export default Comment;

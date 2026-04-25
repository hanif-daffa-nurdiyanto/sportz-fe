import { cn } from "@/lib/utils";

const Signal = ({ isConnected }: { isConnected: boolean }) => {
  return (
    <div className="border-2 border-slate-700 flex gap-2 py-2 px-4 rounded-2xl items-center bg-slate-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
      <div
        className={cn(
          "w-4 h-4 rounded-full border-2 border-slate-700",
          isConnected ? "bg-green-500" : "bg-red-500",
        )}
      />

      <p className="uppercase truncate flex-1">
        {isConnected ? "connected" : "disconnected"}
      </p>
    </div>
  );
};

export default Signal;

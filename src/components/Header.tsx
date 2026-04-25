import Signal from "./Signal";
import { useWebSocket } from "@/hooks/useWebSocket";

const Header = () => {
  const { isConnected } = useWebSocket();

  return (
    <section className="flex flex-col border-black gap-y-5 sm:flex-row bg-amber-300 p-10 rounded-4xl border-2 shadow-[7px_7px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex-1">
        <h1 className="font-bold text-2xl capitalize">sportz</h1>
        <h2 className="text-semibold text-slate-700">
          real time match data demo
        </h2>
      </div>
      <Signal isConnected={isConnected} />
    </section>
  );
};

export default Header;

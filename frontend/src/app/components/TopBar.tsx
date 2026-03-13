import { useState, useEffect } from "react";
import { Wifi, WifiOff, Bell, Settings, Leaf, ChevronDown, Signal } from "lucide-react";

interface TopBarProps {
  connected: boolean;
}

export function TopBar({ connected }: TopBarProps) {
  const [time, setTime] = useState(new Date());
  const [alerts] = useState(2);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="h-14 bg-[#0c1220] border-b border-[#1e2d40] flex items-center px-4 md:px-6 gap-4 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 mr-4">
        <div className="w-7 h-7 bg-emerald-500/20 border border-emerald-500/30 rounded-lg flex items-center justify-center">
          <Leaf size={15} className="text-emerald-400" />
        </div>
        <div className="hidden md:block">
          <span className="text-white text-sm font-medium">AgroSense</span>
          <span className="text-slate-500 text-xs block -mt-0.5">Smart Farm Monitor</span>
        </div>
      </div>

      {/* Farm selector */}
      <button className="hidden sm:flex items-center gap-2 bg-[#131a26] border border-[#1e2d40] rounded-lg px-3 py-1.5 text-xs text-slate-300 hover:border-slate-500 transition-colors">
        <span className="w-2 h-2 bg-emerald-400 rounded-full" />
        Greenhouse Unit A
        <ChevronDown size={12} className="text-slate-500" />
      </button>

      <div className="flex-1" />

      {/* Signal strength */}
      <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500">
        <Signal size={13} />
        <span>-67 dBm</span>
      </div>

      {/* Connection status */}
      <div
        className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${
          connected
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            : "bg-red-500/10 border-red-500/20 text-red-400"
        }`}
      >
        {connected ? <Wifi size={12} /> : <WifiOff size={12} />}
        <span className="hidden sm:inline">{connected ? "Connected" : "Disconnected"}</span>
      </div>

      {/* Clock */}
      <div className="hidden md:block text-xs font-mono text-slate-400">
        {time.toLocaleTimeString()}
      </div>

      {/* Notifications */}
      <button className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-[#131a26] border border-[#1e2d40] text-slate-400 hover:text-white hover:border-slate-500 transition-colors">
        <Bell size={14} />
        {alerts > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center">
            {alerts}
          </span>
        )}
      </button>

      {/* Settings */}
      <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#131a26] border border-[#1e2d40] text-slate-400 hover:text-white hover:border-slate-500 transition-colors">
        <Settings size={14} />
      </button>
    </header>
  );
}

import { useState, useEffect, useRef } from "react";
import { Droplets, Power, AlertTriangle, CheckCircle2, Clock, Zap, Activity } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PumpLog {
  id: number;
  action: "ON" | "OFF";
  timestamp: Date;
  duration?: number;
  trigger: "manual" | "auto";
}

interface PumpControlProps {
  currentHumidity: number;
  autoThreshold: number;
}

export function PumpControl({ currentHumidity, autoThreshold }: PumpControlProps) {
  const [pumpOn, setPumpOn] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  const [log, setLog] = useState<PumpLog[]>([]);
  const [runDuration, setRunDuration] = useState(0);
  const [totalRuntime, setTotalRuntime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastToggleRef = useRef<Date>(new Date());
  const logIdRef = useRef(0);

  // Track run duration when pump is on
  useEffect(() => {
    if (pumpOn) {
      timerRef.current = setInterval(() => {
        setRunDuration((d) => d + 1);
        setTotalRuntime((t) => t + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRunDuration(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [pumpOn]);

  // Auto mode: turn pump on/off based on humidity threshold
  useEffect(() => {
    if (!autoMode) return;
    if (currentHumidity < autoThreshold && !pumpOn) {
      togglePump("auto");
    } else if (currentHumidity >= autoThreshold + 10 && pumpOn) {
      togglePump("auto");
    }
  }, [autoMode, currentHumidity, pumpOn, autoThreshold]);

  const togglePump = (trigger: "manual" | "auto" = "manual") => {
    const now = new Date();
    const action = pumpOn ? "OFF" : "ON";
    const duration = pumpOn
      ? Math.round((now.getTime() - lastToggleRef.current.getTime()) / 1000)
      : undefined;

    setLog((prev) => [
      { id: ++logIdRef.current, action, timestamp: now, duration, trigger },
      ...prev.slice(0, 9),
    ]);
    lastToggleRef.current = now;
    setPumpOn((v) => !v);
  };

  const formatDuration = (s: number) => {
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m}m ${rem}s`;
  };

  return (
    <div className="bg-[#131a26] border border-[#1e2d40] rounded-xl p-4 flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Droplets size={14} className="text-sky-400" />
          <div>
            <h3 className="text-white text-sm">Humidity Relay Pump</h3>
            <p className="text-slate-500 text-xs mt-0.5">Manual & automatic irrigation control</p>
          </div>
        </div>
        <div
          className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs border ${
            pumpOn
              ? "bg-sky-500/15 border-sky-500/30 text-sky-400"
              : "bg-slate-800 border-[#1e2d40] text-slate-500"
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${pumpOn ? "bg-sky-400 animate-pulse" : "bg-slate-600"}`} />
          {pumpOn ? "Running" : "Standby"}
        </div>
      </div>

      {/* Main pump button */}
      <div className="flex flex-col items-center gap-3">
        <motion.button
          onClick={() => togglePump("manual")}
          whileTap={{ scale: 0.94 }}
          className={`relative w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center gap-1 transition-all duration-300 shadow-lg ${
            pumpOn
              ? "bg-sky-500/20 border-sky-400 shadow-sky-500/30 text-sky-300"
              : "bg-[#1a2535] border-[#2a4060] text-slate-500 hover:border-slate-500 hover:text-slate-300"
          }`}
        >
          {/* Ripple animation when pump is on */}
          <AnimatePresence>
            {pumpOn && (
              <>
                {[1, 2, 3].map((i) => (
                  <motion.span
                    key={i}
                    className="absolute inset-0 rounded-full border-2 border-sky-400"
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{ scale: 1.7 + i * 0.3, opacity: 0 }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      delay: i * 0.5,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>
          <Power size={22} />
          <span className="text-[10px] font-medium tracking-wider">
            {pumpOn ? "STOP" : "START"}
          </span>
        </motion.button>

        {/* Run timer */}
        <AnimatePresence>
          {pumpOn && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 text-sky-400 text-sm font-mono"
            >
              <Activity size={12} className="animate-pulse" />
              {formatDuration(runDuration)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status & stats row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#0e1520] rounded-lg p-2.5 border border-[#1e2d40] flex flex-col gap-1">
          <span className="text-slate-500 text-[10px]">Current Humidity</span>
          <span className={`text-sm font-mono ${currentHumidity < autoThreshold ? "text-amber-400" : "text-sky-400"}`}>
            {currentHumidity.toFixed(1)}%
          </span>
        </div>
        <div className="bg-[#0e1520] rounded-lg p-2.5 border border-[#1e2d40] flex flex-col gap-1">
          <span className="text-slate-500 text-[10px]">Threshold</span>
          <span className="text-sm font-mono text-slate-300">{autoThreshold}%</span>
        </div>
        <div className="bg-[#0e1520] rounded-lg p-2.5 border border-[#1e2d40] flex flex-col gap-1">
          <span className="text-slate-500 text-[10px]">Total Runtime</span>
          <span className="text-sm font-mono text-slate-300">{formatDuration(totalRuntime)}</span>
        </div>
      </div>

      {/* Low humidity alert */}
      <AnimatePresence>
        {currentHumidity < autoThreshold && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/25 rounded-lg px-3 py-2"
          >
            <AlertTriangle size={13} className="text-amber-400 shrink-0" />
            <span className="text-amber-300 text-xs">
              Humidity below threshold ({autoThreshold}%). Irrigation recommended.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auto mode toggle */}
      <div className="flex items-center justify-between bg-[#0e1520] rounded-lg px-3 py-2.5 border border-[#1e2d40]">
        <div className="flex items-center gap-2">
          <Zap size={13} className={autoMode ? "text-amber-400" : "text-slate-500"} />
          <span className="text-slate-300 text-xs">Auto-irrigation mode</span>
        </div>
        <button
          onClick={() => setAutoMode((v) => !v)}
          className={`w-10 h-5 rounded-full relative transition-all duration-300 ${
            autoMode ? "bg-amber-500" : "bg-[#1e2d40]"
          }`}
        >
          <motion.span
            animate={{ x: autoMode ? 20 : 2 }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
            className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
          />
        </button>
      </div>

      {/* Activity log */}
      <div className="flex-1 overflow-hidden flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
          <Clock size={11} />
          Activity Log
        </div>
        <div className="space-y-1 overflow-y-auto max-h-[120px] pr-1">
          {log.length === 0 && (
            <p className="text-slate-600 text-xs text-center py-3">No activity yet</p>
          )}
          {log.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-xs bg-[#0e1520] rounded-lg px-2.5 py-1.5 border border-[#1e2d40]"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  entry.action === "ON" ? "bg-sky-400" : "bg-slate-500"
                }`}
              />
              <span className={entry.action === "ON" ? "text-sky-400" : "text-slate-400"}>
                {entry.action}
              </span>
              <span className="text-slate-600 flex-1">
                {entry.timestamp.toLocaleTimeString()}
                {entry.duration !== undefined && ` · ran ${formatDuration(entry.duration)}`}
              </span>
              <span
                className={`text-[10px] px-1 rounded ${
                  entry.trigger === "auto"
                    ? "bg-amber-500/15 text-amber-400"
                    : "bg-slate-700 text-slate-500"
                }`}
              >
                {entry.trigger}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

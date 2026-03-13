import { useEffect, useRef, useState } from "react";
import { Eye, EyeOff, Camera, RefreshCw, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const FARM_IMAGE = "https://images.unsplash.com/photo-1771752276608-e3d80eae658a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21hdG8lMjBwbGFudCUyMGdyZWVuaG91c2UlMjBjcm9wJTIwaW5kb29yJTIwZmFybWluZ3xlbnwxfHx8fDE3NzI2NDUzNzB8MA&ixlib=rb-4.1.0&q=80&w=1080";

interface AttentionHotspot {
  cx: number; // 0-1 relative
  cy: number; // 0-1 relative
  r: number;  // 0-1 relative radius
  intensity: number; // 0-1
  label: string;
  color: string;
}

const hotspots: AttentionHotspot[] = [
  { cx: 0.22, cy: 0.38, r: 0.14, intensity: 0.9, label: "Wilting detected", color: "#f97316" },
  { cx: 0.68, cy: 0.55, r: 0.18, intensity: 0.75, label: "Healthy foliage", color: "#22c55e" },
  { cx: 0.45, cy: 0.72, r: 0.12, intensity: 0.6, label: "Low moisture zone", color: "#ef4444" },
  { cx: 0.78, cy: 0.28, r: 0.10, intensity: 0.5, label: "Growth point", color: "#a78bfa" },
  { cx: 0.30, cy: 0.65, r: 0.09, intensity: 0.7, label: "Pest risk", color: "#fb923c" },
];

interface CameraViewProps {
  showOverlay: boolean;
  onToggleOverlay: () => void;
}

export function CameraView({ showOverlay, onToggleOverlay }: CameraViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [frameTime, setFrameTime] = useState(new Date());
  const [fps] = useState(24);
  const [pulsePhase, setPulsePhase] = useState(0);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const interval = setInterval(() => setFrameTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let start: number | null = null;
    const animate = (ts: number) => {
      if (!start) start = ts;
      setPulsePhase(((ts - start) / 1200) % (Math.PI * 2));
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const w = container.clientWidth;
    const h = container.clientHeight;
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);

    if (!showOverlay) return;

    // Draw heatmap blobs
    hotspots.forEach((hs) => {
      const x = hs.cx * w;
      const y = hs.cy * h;
      const r = hs.r * Math.min(w, h);
      const pulse = 1 + 0.06 * Math.sin(pulsePhase + hs.cx * 3);
      const pr = r * pulse;

      const grad = ctx.createRadialGradient(x, y, 0, x, y, pr);
      const alpha = hs.intensity * 0.55;

      // Parse hex color
      const hex = hs.color.replace("#", "");
      const R = parseInt(hex.substring(0, 2), 16);
      const G = parseInt(hex.substring(2, 4), 16);
      const B = parseInt(hex.substring(4, 6), 16);

      grad.addColorStop(0, `rgba(${R},${G},${B},${alpha})`);
      grad.addColorStop(0.5, `rgba(${R},${G},${B},${alpha * 0.4})`);
      grad.addColorStop(1, `rgba(${R},${G},${B},0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, pr, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw border rings
    hotspots.forEach((hs) => {
      const x = hs.cx * w;
      const y = hs.cy * h;
      const r = hs.r * Math.min(w, h);
      const pulse = 1 + 0.08 * Math.sin(pulsePhase + hs.cx * 3);
      const pr = r * pulse;

      const hex = hs.color.replace("#", "");
      const R = parseInt(hex.substring(0, 2), 16);
      const G = parseInt(hex.substring(2, 4), 16);
      const B = parseInt(hex.substring(4, 6), 16);
      const ringAlpha = 0.7 + 0.3 * Math.sin(pulsePhase * 2 + hs.cy * 5);

      ctx.strokeStyle = `rgba(${R},${G},${B},${ringAlpha})`;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(x, y, pr, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    });
  }, [showOverlay, pulsePhase]);

  return (
    <div className="bg-[#131a26] border border-[#1e2d40] rounded-xl p-4 flex flex-col gap-3 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera size={14} className="text-slate-400" />
          <div>
            <h3 className="text-white text-sm">Field Camera Feed</h3>
            <p className="text-slate-500 text-xs mt-0.5">
              {frameTime.toLocaleTimeString()} · {fps} FPS
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleOverlay}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all ${
              showOverlay
                ? "bg-violet-500/20 border-violet-500/40 text-violet-300 hover:bg-violet-500/30"
                : "bg-[#1e2d40] border-[#2a4060] text-slate-400 hover:text-white hover:border-slate-500"
            }`}
          >
            {showOverlay ? <Eye size={13} /> : <EyeOff size={13} />}
            {showOverlay ? "Hide Overlay" : "Show Overlay"}
          </button>
        </div>
      </div>

      {/* Camera frame */}
      <div
        ref={containerRef}
        className="relative flex-1 rounded-lg overflow-hidden bg-black"
        style={{ minHeight: 200 }}
      >
        <img
          src={FARM_IMAGE}
          alt="Field Camera"
          className="w-full h-full object-cover"
          onLoad={() => setImgLoaded(true)}
        />

        {/* Overlay canvas */}
        <AnimatePresence>
          {showOverlay && (
            <motion.canvas
              key="overlay"
              ref={canvasRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 w-full h-full pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Hotspot labels */}
        <AnimatePresence>
          {showOverlay && hotspots.map((hs, i) => {
            const hex = hs.color.replace("#", "");
            const R = parseInt(hex.substring(0, 2), 16);
            const G = parseInt(hex.substring(2, 4), 16);
            const B = parseInt(hex.substring(4, 6), 16);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ delay: i * 0.08, duration: 0.25 }}
                className="absolute text-[10px] font-medium px-1.5 py-0.5 rounded-md pointer-events-none"
                style={{
                  left: `${hs.cx * 100}%`,
                  top: `${hs.cy * 100}%`,
                  transform: "translate(-50%, -50%)",
                  backgroundColor: `rgba(${R},${G},${B},0.85)`,
                  color: "#fff",
                  marginTop: `${hs.r * 60 + 12}px`,
                  boxShadow: `0 0 8px rgba(${R},${G},${B},0.5)`,
                }}
              >
                {hs.label}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* REC indicator */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded px-2 py-1">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
          <span className="text-white text-[10px] font-mono">REC</span>
        </div>

        {/* CAM label */}
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded px-2 py-1">
          <span className="text-slate-300 text-[10px] font-mono">CAM-01 · Zone A</span>
        </div>

        {/* Overlay legend */}
        <AnimatePresence>
          {showOverlay && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1"
            >
              {hotspots.map((hs, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded px-1.5 py-0.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: hs.color }} />
                  <span className="text-[9px] text-white/80">{hs.label}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

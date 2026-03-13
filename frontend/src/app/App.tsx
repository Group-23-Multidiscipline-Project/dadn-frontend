import { useState, useEffect } from "react";
import { TopBar } from "./components/TopBar";
import { SensorCards } from "./components/SensorCards";
import { RealtimeChart, ChartDataPoint } from "./components/RealtimeChart";
import { HeatmapGrid, HeatmapCell } from "./components/HeatmapGrid";
import { CameraView } from "./components/CameraView";
import { PumpControl } from "./components/PumpControl";
import { LayoutDashboard, Thermometer, MapPin, Camera, Activity } from "lucide-react";

// ─── Helpers ────────────────────────────────────────────────────────────────

function clamp(val: number, min: number, max: number) {
  return Math.min(max, Math.max(min, val));
}

function randomWalk(current: number, step: number, min: number, max: number) {
  return clamp(current + (Math.random() - 0.5) * step * 2, min, max);
}

function generateHeatmap(rows: number, cols: number, baseHum: number, baseTemp: number): HeatmapCell[][] {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      row: r,
      col: c,
      humidity: clamp(baseHum + (Math.random() - 0.5) * 30, 5, 95),
      temperature: clamp(baseTemp + (Math.random() - 0.5) * 12, 10, 45),
    }))
  );
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

const MAX_HISTORY = 40;

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  // ── Sensor state ──────────────────────────────────────────────────────────
  const [temperature, setTemperature] = useState(24.5);
  const [humidity, setHumidity] = useState(62.0);
  const [soilMoisture, setSoilMoisture] = useState(48.0);
  const [lightLevel, setLightLevel] = useState(32000);

  // ── Chart history ─────────────────────────────────────────────────────────
  const [chartData, setChartData] = useState<ChartDataPoint[]>(() => {
    const now = new Date();
    return Array.from({ length: 20 }, (_, i) => ({
      time: formatTime(new Date(now.getTime() - (19 - i) * 3000)),
      temperature: clamp(24.5 + (Math.random() - 0.5) * 6, 10, 45),
      humidity: clamp(62 + (Math.random() - 0.5) * 20, 0, 100),
    }));
  });

  // ── Heatmap ───────────────────────────────────────────────────────────────
  const [heatmapCells, setHeatmapCells] = useState<HeatmapCell[][]>(() =>
    generateHeatmap(6, 8, 62, 24.5)
  );
  const [heatmapMode, setHeatmapMode] = useState<"humidity" | "temperature">("humidity");

  // ── Overlay ───────────────────────────────────────────────────────────────
  const [showOverlay, setShowOverlay] = useState(true);

  // ── UI ────────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<"dashboard" | "charts" | "heatmap" | "camera" | "pump">("dashboard");

  // ── Simulate real-time sensor data ────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      const newTemp = randomWalk(temperature, 0.4, 10, 42);
      const newHum = randomWalk(humidity, 1.2, 20, 95);
      const newSoil = randomWalk(soilMoisture, 0.8, 10, 90);
      const newLight = randomWalk(lightLevel, 1500, 1000, 90000);

      setTemperature(newTemp);
      setHumidity(newHum);
      setSoilMoisture(newSoil);
      setLightLevel(newLight);

      setChartData((prev) => {
        const next = [
          ...prev,
          {
            time: formatTime(new Date()),
            temperature: parseFloat(newTemp.toFixed(1)),
            humidity: parseFloat(newHum.toFixed(1)),
          },
        ];
        return next.slice(-MAX_HISTORY);
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [temperature, humidity, soilMoisture, lightLevel]);

  // Refresh heatmap every 8s
  useEffect(() => {
    const interval = setInterval(() => {
      setHeatmapCells(generateHeatmap(6, 8, humidity, temperature));
    }, 8000);
    return () => clearInterval(interval);
  }, [humidity, temperature]);

  // ── Tabs ──────────────────────────────────────────────────────────────────
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={15} /> },
    { id: "charts", label: "Charts", icon: <Activity size={15} /> },
    { id: "heatmap", label: "Heatmap", icon: <MapPin size={15} /> },
    { id: "camera", label: "Camera", icon: <Camera size={15} /> },
    { id: "pump", label: "Pump", icon: <Thermometer size={15} /> },
  ] as const;

  return (
    <div className="min-h-screen bg-[#080e18] text-white flex flex-col">
      <TopBar connected={true} />

      {/* Tab navigation */}
      <nav className="bg-[#0c1220] border-b border-[#1e2d40] px-4 md:px-6 flex items-center gap-1 overflow-x-auto shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-xs border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "border-emerald-400 text-emerald-400"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-3 md:p-4 lg:p-5">
        {/* ── DASHBOARD ─────────────────────────────────────────── */}
        {activeTab === "dashboard" && (
          <div className="flex flex-col gap-4 max-w-[1600px] mx-auto">
            {/* Sensor cards */}
            <SensorCards
              temperature={temperature}
              humidity={humidity}
              soilMoisture={soilMoisture}
              lightLevel={lightLevel}
            />

            {/* Row 2: Chart + Camera */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div style={{ minHeight: 340 }}>
                <RealtimeChart data={chartData} />
              </div>
              <div style={{ minHeight: 340 }}>
                <CameraView showOverlay={showOverlay} onToggleOverlay={() => setShowOverlay((v) => !v)} />
              </div>
            </div>

            {/* Row 3: Heatmap + Pump */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                {/* Heatmap mode toggle */}
                <div className="flex items-center gap-2 mb-2">
                  <button
                    onClick={() => setHeatmapMode("humidity")}
                    className={`text-xs px-3 py-1 rounded-lg border transition-all ${
                      heatmapMode === "humidity"
                        ? "bg-sky-500/20 border-sky-500/40 text-sky-400"
                        : "bg-[#131a26] border-[#1e2d40] text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    Humidity Map
                  </button>
                  <button
                    onClick={() => setHeatmapMode("temperature")}
                    className={`text-xs px-3 py-1 rounded-lg border transition-all ${
                      heatmapMode === "temperature"
                        ? "bg-orange-500/20 border-orange-500/40 text-orange-400"
                        : "bg-[#131a26] border-[#1e2d40] text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    Temperature Map
                  </button>
                </div>
                <div style={{ minHeight: 300 }}>
                  <HeatmapGrid cells={heatmapCells} mode={heatmapMode} />
                </div>
              </div>
              <div style={{ minHeight: 300 }}>
                <PumpControl currentHumidity={humidity} autoThreshold={45} />
              </div>
            </div>
          </div>
        )}

        {/* ── CHARTS ────────────────────────────────────────────── */}
        {activeTab === "charts" && (
          <div className="flex flex-col gap-4 max-w-[1200px] mx-auto">
            <SensorCards
              temperature={temperature}
              humidity={humidity}
              soilMoisture={soilMoisture}
              lightLevel={lightLevel}
            />
            <div style={{ minHeight: 400 }}>
              <RealtimeChart data={chartData} />
            </div>
          </div>
        )}

        {/* ── HEATMAP ───────────────────────────────────────────── */}
        {activeTab === "heatmap" && (
          <div className="flex flex-col gap-4 max-w-[900px] mx-auto">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setHeatmapMode("humidity")}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                  heatmapMode === "humidity"
                    ? "bg-sky-500/20 border-sky-500/40 text-sky-400"
                    : "bg-[#131a26] border-[#1e2d40] text-slate-500 hover:text-slate-300"
                }`}
              >
                Humidity Map
              </button>
              <button
                onClick={() => setHeatmapMode("temperature")}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                  heatmapMode === "temperature"
                    ? "bg-orange-500/20 border-orange-500/40 text-orange-400"
                    : "bg-[#131a26] border-[#1e2d40] text-slate-500 hover:text-slate-300"
                }`}
              >
                Temperature Map
              </button>
            </div>
            <div style={{ minHeight: 480 }}>
              <HeatmapGrid cells={heatmapCells} mode={heatmapMode} />
            </div>
          </div>
        )}

        {/* ── CAMERA ────────────────────────────────────────────── */}
        {activeTab === "camera" && (
          <div className="flex flex-col gap-4 max-w-[900px] mx-auto" style={{ minHeight: 520 }}>
            <CameraView showOverlay={showOverlay} onToggleOverlay={() => setShowOverlay((v) => !v)} />
          </div>
        )}

        {/* ── PUMP ──────────────────────────────────────────────── */}
        {activeTab === "pump" && (
          <div className="max-w-[480px] mx-auto" style={{ minHeight: 520 }}>
            <PumpControl currentHumidity={humidity} autoThreshold={45} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#0c1220] border-t border-[#1e2d40] px-4 md:px-6 py-2 flex items-center gap-4 text-[11px] text-slate-600 shrink-0">
        <span>AgroSense Dashboard v2.1</span>
        <span className="text-[#1e2d40]">|</span>
        <span>Sensors: 4 active</span>
        <span className="text-[#1e2d40]">|</span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          All systems nominal
        </span>
        <span className="ml-auto">© 2026 AgroSense IoT Platform</span>
      </footer>
    </div>
  );
}
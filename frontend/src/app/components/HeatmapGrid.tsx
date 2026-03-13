import { useEffect, useRef } from "react";

export interface HeatmapCell {
  row: number;
  col: number;
  humidity: number;
  temperature: number;
}

interface HeatmapGridProps {
  cells: HeatmapCell[][];
  mode: "humidity" | "temperature";
}

function getHumidityColor(value: number): string {
  // 0-30: red (drought), 30-60: yellow (moderate), 60-100: blue/teal (humid)
  if (value < 30) {
    const t = value / 30;
    const r = 220;
    const g = Math.round(60 + t * 100);
    const b = 60;
    return `rgba(${r},${g},${b},0.85)`;
  } else if (value < 60) {
    const t = (value - 30) / 30;
    const r = Math.round(220 - t * 180);
    const g = Math.round(160 + t * 50);
    const b = Math.round(60 + t * 80);
    return `rgba(${r},${g},${b},0.85)`;
  } else {
    const t = (value - 60) / 40;
    const r = Math.round(40 - t * 20);
    const g = Math.round(210 - t * 70);
    const b = Math.round(140 + t * 100);
    return `rgba(${r},${g},${b},0.85)`;
  }
}

function getTemperatureColor(value: number): string {
  // 10-25: blue-green (cool), 25-35: orange, 35-45: red (hot)
  if (value < 25) {
    const t = (value - 10) / 15;
    const r = Math.round(30 + t * 60);
    const g = Math.round(120 + t * 80);
    const b = Math.round(220 - t * 60);
    return `rgba(${r},${g},${b},0.85)`;
  } else if (value < 35) {
    const t = (value - 25) / 10;
    const r = Math.round(90 + t * 160);
    const g = Math.round(200 - t * 120);
    const b = Math.round(160 - t * 130);
    return `rgba(${r},${g},${b},0.85)`;
  } else {
    const t = (value - 35) / 10;
    const r = 250;
    const g = Math.round(80 - t * 60);
    const b = Math.round(30 - t * 20);
    return `rgba(${r},${g},${b},0.85)`;
  }
}

export function HeatmapGrid({ cells, mode }: HeatmapGridProps) {
  return (
    <div className="bg-[#131a26] border border-[#1e2d40] rounded-xl p-4 flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white text-sm">Field Zone Heatmap</h3>
          <p className="text-slate-500 text-xs mt-0.5">
            {mode === "humidity" ? "Soil humidity distribution" : "Temperature distribution"} across zones
          </p>
        </div>
        <div className="text-xs text-slate-500 bg-[#0e1520] px-2 py-1 rounded-lg border border-[#1e2d40]">
          {cells.length} × {cells[0]?.length || 0} grid
        </div>
      </div>

      {/* Heatmap */}
      <div className="flex-1 flex flex-col gap-1">
        {cells.map((row, rowIdx) => (
          <div key={rowIdx} className="flex gap-1 flex-1">
            {row.map((cell, colIdx) => {
              const value = mode === "humidity" ? cell.humidity : cell.temperature;
              const color = mode === "humidity"
                ? getHumidityColor(cell.humidity)
                : getTemperatureColor(cell.temperature);
              const label = mode === "humidity"
                ? `${cell.humidity.toFixed(0)}%`
                : `${cell.temperature.toFixed(0)}°`;
              return (
                <div
                  key={colIdx}
                  className="flex-1 rounded-md flex items-center justify-center text-[9px] font-mono text-white/70 transition-all duration-700 cursor-pointer hover:scale-105 hover:z-10 relative group"
                  style={{ backgroundColor: color, minHeight: 28 }}
                  title={`Zone ${rowIdx + 1}-${colIdx + 1}: ${label}`}
                >
                  <span className="hidden group-hover:block absolute -top-6 left-1/2 -translate-x-1/2 bg-[#0e1520] border border-[#1e2d40] rounded px-1.5 py-0.5 text-xs text-white whitespace-nowrap z-20 pointer-events-none">
                    {label}
                  </span>
                  {label}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-1">
        <span className="text-slate-600 text-xs whitespace-nowrap">
          {mode === "humidity" ? "Dry" : "Cool"}
        </span>
        <div
          className="flex-1 h-2 rounded-full"
          style={{
            background: mode === "humidity"
              ? "linear-gradient(to right, rgba(220,80,60,0.85), rgba(180,190,80,0.85), rgba(40,190,210,0.85))"
              : "linear-gradient(to right, rgba(30,150,200,0.85), rgba(240,140,30,0.85), rgba(250,30,20,0.85))",
          }}
        />
        <span className="text-slate-600 text-xs whitespace-nowrap">
          {mode === "humidity" ? "Wet" : "Hot"}
        </span>
      </div>
    </div>
  );
}

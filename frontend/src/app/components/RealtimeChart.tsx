import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export interface ChartDataPoint {
  time: string;
  temperature: number;
  humidity: number;
}

interface RealtimeChartProps {
  data: ChartDataPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0e1520] border border-[#1e2d40] rounded-lg p-3 shadow-xl">
        <p className="text-slate-400 text-xs mb-2">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-300 capitalize">{entry.name}:</span>
            <span className="text-white font-mono">
              {entry.value.toFixed(1)}
              {entry.name === "temperature" ? "°C" : "%"}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function RealtimeChart({ data }: RealtimeChartProps) {
  return (
    <div className="bg-[#131a26] border border-[#1e2d40] rounded-xl p-4 flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white text-sm">Realtime Sensor Feed</h3>
          <p className="text-slate-500 text-xs mt-0.5">Temperature & Humidity over time</p>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-emerald-400 text-xs">Live</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="humGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e2d40" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fill: "#475569", fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "#1e2d40" }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: "#475569", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: 8 }}
            formatter={(value) => (
              <span style={{ color: "#94a3b8", fontSize: 12 }}>{value}</span>
            )}
          />
          <ReferenceLine y={30} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.4} />
          <ReferenceLine y={60} stroke="#38bdf8" strokeDasharray="4 4" strokeOpacity={0.4} />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#f97316"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#f97316", strokeWidth: 0 }}
            animationDuration={300}
          />
          <Line
            type="monotone"
            dataKey="humidity"
            stroke="#38bdf8"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#38bdf8", strokeWidth: 0 }}
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="flex items-center gap-4 text-xs text-slate-600 border-t border-[#1e2d40] pt-2 mt-auto">
        <span className="flex items-center gap-1.5">
          <span className="w-8 h-0.5 bg-red-500 opacity-40 inline-block border-dashed border-t border-red-500" />
          Temp threshold (30°C)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-8 h-0.5 bg-sky-500 opacity-40 inline-block border-dashed border-t border-sky-500" />
          Humidity threshold (60%)
        </span>
      </div>
    </div>
  );
}

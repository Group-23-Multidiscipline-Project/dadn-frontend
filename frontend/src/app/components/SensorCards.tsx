import { Thermometer, Droplets, Sun, Wind } from "lucide-react";
import { motion } from "motion/react";

interface SensorCardProps {
  title: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  min: number;
  max: number;
  status: "normal" | "warning" | "critical";
  trend: "up" | "down" | "stable";
}

function SensorCard({ title, value, unit, icon, color, bgColor, min, max, status, trend }: SensorCardProps) {
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  const statusColors = {
    normal: "text-emerald-400",
    warning: "text-amber-400",
    critical: "text-red-400",
  };
  const statusDots = {
    normal: "bg-emerald-400",
    warning: "bg-amber-400",
    critical: "bg-red-400",
  };
  const trendArrow = trend === "up" ? "↑" : trend === "down" ? "↓" : "→";
  const trendColor = trend === "up" ? "text-red-400" : trend === "down" ? "text-sky-400" : "text-slate-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#131a26] border border-[#1e2d40] rounded-xl p-4 flex flex-col gap-3 hover:border-[#2a4060] transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bgColor}`}>
            <span className={color}>{icon}</span>
          </div>
          <span className="text-slate-400 text-sm">{title}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${statusDots[status]} animate-pulse`} />
          <span className={`text-xs ${statusColors[status]}`}>{status}</span>
        </div>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-mono text-white">{value.toFixed(1)}</span>
        <span className="text-slate-500 mb-1">{unit}</span>
        <span className={`ml-auto mb-1 text-sm font-mono ${trendColor}`}>{trendArrow}</span>
      </div>
      <div className="w-full h-1.5 bg-[#1e2d40] rounded-full overflow-hidden">
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className={`h-full rounded-full ${color.replace("text-", "bg-")}`}
          style={{ minWidth: 4 }}
        />
      </div>
      <div className="flex justify-between text-xs text-slate-600">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </motion.div>
  );
}

interface SensorCardsProps {
  humidity: number;
  temperature: number;
  soilMoisture: number;
  lightLevel: number;
}

export function SensorCards({ humidity, temperature, soilMoisture, lightLevel }: SensorCardsProps) {
  const cards: SensorCardProps[] = [
    {
      title: "Temperature",
      value: temperature,
      unit: "°C",
      icon: <Thermometer size={16} />,
      color: "text-orange-400",
      bgColor: "bg-orange-900/30",
      min: 10,
      max: 45,
      status: temperature > 38 ? "critical" : temperature > 30 ? "warning" : "normal",
      trend: temperature > 28 ? "up" : temperature < 20 ? "down" : "stable",
    },
    {
      title: "Air Humidity",
      value: humidity,
      unit: "%",
      icon: <Droplets size={16} />,
      color: "text-sky-400",
      bgColor: "bg-sky-900/30",
      min: 0,
      max: 100,
      status: humidity < 30 ? "critical" : humidity < 50 ? "warning" : "normal",
      trend: humidity > 70 ? "up" : humidity < 40 ? "down" : "stable",
    },
    {
      title: "Soil Moisture",
      value: soilMoisture,
      unit: "%",
      icon: <Droplets size={16} />,
      color: "text-emerald-400",
      bgColor: "bg-emerald-900/30",
      min: 0,
      max: 100,
      status: soilMoisture < 25 ? "critical" : soilMoisture < 40 ? "warning" : "normal",
      trend: soilMoisture > 60 ? "up" : soilMoisture < 30 ? "down" : "stable",
    },
    {
      title: "Light Level",
      value: lightLevel,
      unit: " lux",
      icon: <Sun size={16} />,
      color: "text-yellow-400",
      bgColor: "bg-yellow-900/30",
      min: 0,
      max: 100000,
      status: lightLevel < 5000 ? "warning" : "normal",
      trend: lightLevel > 50000 ? "up" : lightLevel < 10000 ? "down" : "stable",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card) => (
        <SensorCard key={card.title} {...card} />
      ))}
    </div>
  );
}

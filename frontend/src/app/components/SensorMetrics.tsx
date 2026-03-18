import { Droplet, Sun } from "lucide-react";

interface SensorMetricsProps {
  humidity: number;
  lightLevel: number;
}

export function SensorMetrics({ humidity, lightLevel }: SensorMetricsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Humidity */}
      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-3">
          <Droplet size={24} className="text-blue-600" />
        </div>
        <div className="text-xs text-gray-500 mb-1">ĐỘ ẨM TB</div>
        <div className="text-2xl font-bold text-gray-900">{humidity.toFixed(2)}%</div>
      </div>

      {/* Light */}
      <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200">
        <div className="flex items-center justify-center w-12 h-12 bg-emerald-500 rounded-xl mb-3">
          <Sun size={24} className="text-white" />
        </div>
        <div className="text-xs text-emerald-700 mb-1">ÁNH SÁNG TB</div>
        <div className="text-2xl font-bold text-gray-900">{lightLevel.toFixed(2)} lx</div>
      </div>
    </div>
  );
}
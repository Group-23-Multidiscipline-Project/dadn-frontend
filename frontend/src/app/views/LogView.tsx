import { ActivityTimeline } from "../components/ActivityTimeline";
import { Chart24h } from "../components/Chart24h";
import { SensorMetrics } from "../components/SensorMetrics";

interface LogViewProps {
  chartData: Array<{ time: string; humidity: number; light: number }>;
  humidity: number;
  lightLevel: number;
  soilMoisture: number;
}

export function LogView({ chartData, humidity, lightLevel, soilMoisture }: LogViewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left column */}
      <div className="space-y-6">
        <ActivityTimeline />
      </div>

      {/* Right column */}
      <div className="space-y-6">
        <Chart24h data={chartData} />
        
        {/* Soil and Light Metrics */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-4">ĐỘ ẨM ĐẤT & ÁNH SÁNG</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">ĐỘ ẨM ĐẤT</div>
              <div className="text-2xl font-bold text-gray-900">{soilMoisture.toFixed(2)}%</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">ÁNH SÁNG</div>
              <div className="text-2xl font-bold text-gray-900">{lightLevel.toFixed(2)}%</div>
            </div>
          </div>
        </div>
        
        <SensorMetrics humidity={humidity} lightLevel={lightLevel} />
      </div>
    </div>
  );
}

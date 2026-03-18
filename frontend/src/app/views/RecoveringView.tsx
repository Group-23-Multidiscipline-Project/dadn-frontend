import { RecoveringTimer } from "../components/RecoveringTimer";
import { SoilHydrationGauge } from "../components/SoilHydrationGauge";
import { LightIntensity } from "../components/LightIntensity";
import { VitalityChart } from "../components/VitalityChart";
import { RefreshCw } from "lucide-react";

interface RecoveringViewProps {
  soilMoisture: number;
  lightLevel: number;
  vitality: number;
  lastUpdate: string;
}

export function RecoveringView({ soilMoisture, lightLevel, vitality, lastUpdate }: RecoveringViewProps) {
  return (
    <div>
      {/* Update indicator */}
      <div className="flex items-center justify-end gap-2 mb-4">
        <span className="text-xs text-gray-500">Last update: {lastUpdate}</span>
        <button className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
          <RefreshCw size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recovering Timer - spans 2 columns */}
        <div className="lg:col-span-2">
          <RecoveringTimer />
        </div>

        {/* Soil hydration */}
        <div>
          <SoilHydrationGauge value={soilMoisture} min={30} max={60} />
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <LightIntensity value={lightLevel} avgComparison={12} />
        <VitalityChart
          vitalityLevel={vitality}
          temperatureRange={{ min: 22, max: 24.5 }}
        />
      </div>
    </div>
  );
}
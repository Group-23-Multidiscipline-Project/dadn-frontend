import { Sun } from "lucide-react";

interface LightIntensityProps {
  value: number;
  avgComparison?: number;
}

export function LightIntensity({ value, avgComparison = 12 }: LightIntensityProps) {
  const dots = 6;
  const activeDots = Math.min(Math.floor((value / 15000) * dots), dots);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <div className="flex items-center justify-center w-14 h-14 bg-amber-100 rounded-2xl mb-4">
        <Sun size={28} className="text-amber-600" />
      </div>

      {avgComparison > 0 && (
        <div className="text-xs text-amber-600 font-medium mb-2">
          +{avgComparison}% vs Avg
        </div>
      )}

      <div className="mb-4">
        <div className="text-xs text-gray-500 mb-1">LUMINOUS INTENSITY</div>
        <div className="text-3xl font-bold text-gray-900">{value.toFixed(2)} <span className="text-lg text-gray-500">%</span></div>
      </div>

      {<div className="mb-6">
        <div className="text-xs text-gray-500 mb-2">Cường độ ánh sáng</div>
        <div className="flex gap-2">
          {Array.from({ length: dots }).map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-colors ${i < activeDots ? "bg-amber-400" : "bg-gray-200"
                }`}
            ></div>
          ))}
        </div>
      </div>}

      <div className="h-2 bg-gradient-to-r from-amber-600 via-amber-400 to-gray-300 rounded-full"></div>
    </div>
  );
}
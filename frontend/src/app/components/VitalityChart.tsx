interface VitalityChartProps {
  vitalityLevel: number;
  temperatureRange: { min: number; max: number };
}

export function VitalityChart({ vitalityLevel, temperatureRange }: VitalityChartProps) {
  const warningThreshold = 60;
  const isWarning = vitalityLevel < warningThreshold;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-900 mb-6">Chi số Sinh trưởng (Vitality)</h3>

      <div className="mb-6">
        <div className="h-6 bg-gray-100 rounded-full overflow-hidden relative">
          <div
            className="h-full transition-all duration-500 rounded-full"
            style={{
              width: `${vitalityLevel}%`,
              background: isWarning
                ? "linear-gradient(to right, #f59e0b, #fb923c)"
                : "linear-gradient(to right, #22c55e, #10b981)",
            }}
          >
            <div className="absolute right-0 top-0 h-full px-3 flex items-center">
              <span className="text-xs font-bold text-white">ĐANG HỒI PHỤC ({vitalityLevel.toFixed(2)}%)</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <span className="text-gray-600">Warning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="text-gray-600">Ideal</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-gray-500 mb-1">DỰ KIẾN ỔN ĐỊNH</div>
          <div className="text-lg font-bold text-gray-900">~45 phút</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">NHIỆT ĐỘ RỄ</div>
          <div className="text-lg font-bold text-gray-900">{temperatureRange.max.toFixed(2)}°C</div>
        </div>
      </div>
    </div>
  );
}
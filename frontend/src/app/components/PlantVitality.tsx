interface PlantVitalityProps {
  percentage: number;
}

export function PlantVitality({ percentage }: PlantVitalityProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-gray-500 tracking-wide">PLANT VITALITY RECOVERY</h3>
        <span className="text-2xl font-bold text-emerald-600">{percentage}%</span>
      </div>

      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            background: "linear-gradient(to right, #f59e0b, #84cc16, #22c55e)",
          }}
        ></div>
      </div>
    </div>
  );
}

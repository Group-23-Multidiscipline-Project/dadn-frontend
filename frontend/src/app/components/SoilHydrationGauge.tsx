import { TrendingUp } from "lucide-react";

interface SoilHydrationGaugeProps {
  value: number;
  min?: number;
  max?: number;
}

export function SoilHydrationGauge({ value, min = 30, max = 60 }: SoilHydrationGaugeProps) {
  const isOptimal = value >= min && value <= max;
  const percentage = (value / 100) * 100;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <div className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-lg mb-4">
        SOIL HYDRATION
      </div>

      <div className="flex items-center justify-center mb-6">
        {/* Circular gauge */}
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="80"
              stroke="#e5e7eb"
              strokeWidth="16"
              fill="none"
            />
            <circle
              cx="96"
              cy="96"
              r="80"
              stroke="#059669"
              strokeWidth="16"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 80}`}
              strokeDashoffset={`${2 * Math.PI * 80 * (1 - percentage / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-5xl font-bold text-gray-900">{value.toFixed(2)}</div>
            <div className="text-lg text-gray-600">%</div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <div className="text-sm text-gray-500 mb-2">Ideal Range</div>
        <div className="h-2 bg-gray-200 rounded-full mb-3">
          <div
            className="h-full bg-emerald-500 rounded-full"
            style={{ width: `${((value - min) / (max - min)) * 100}%` }}
          ></div>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>MIN<br />{min}%</span>
          <span>MAX<br />{max}%</span>
        </div>
      </div>

      {/* <div className="mt-4 p-3 bg-emerald-50 rounded-xl flex items-center gap-2">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shrink-0">
          <TrendingUp size={16} className="text-white" />
        </div>
        <span className="text-xs text-emerald-700 font-medium">+12% sau tưới</span>
      </div> */}

      {/* <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 leading-relaxed">
          Mức độ ẩm hiện tại đạt ngưỡng tối ưu sau chu kỳ tưới.
        </p>
      </div> */}
    </div>
  );
}
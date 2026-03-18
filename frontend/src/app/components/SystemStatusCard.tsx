import { Droplet, CheckCircle } from "lucide-react";

interface SystemStatusCardProps {
  mode: "watering" | "monitoring";
  temperature: number;
  remainingTime?: string;
}

export function SystemStatusCard({ mode, temperature, remainingTime }: SystemStatusCardProps) {
  const isWatering = mode === "watering";

  return (
    <div
      className={`rounded-3xl p-8 relative ${
        isWatering
          ? "text-white"
          : "bg-gradient-to-br from-emerald-50 to-green-50 text-gray-900 border border-emerald-200"
      }`}
      style={isWatering ? { background: "linear-gradient(to bottom right, #2563EB, #1D4ED8)" } : undefined}
    >
      {/* Status badge */}
      <div className={`inline-block px-3 py-1 rounded-lg text-xs font-medium mb-6 ${
        isWatering ? "bg-blue-500/40 text-white" : "bg-emerald-500 text-white"
      }`}>
        SYSTEM STATUS
      </div>

      {/* Title */}
      <h2 className="text-4xl font-bold mb-4">
        {isWatering ? "WATERING" : "MONITORING"}
      </h2>

      {/* Description */}
      <p className={`text-sm leading-relaxed mb-8 max-w-md ${
        isWatering ? "text-blue-50" : "text-gray-700"
      }`}>
        {isWatering
          ? "The system is currently irrigating Node_01. All biological parameters are being optimized."
          : "The greenhouse environment is currently optimal. All biological parameters are within the healthy threshold."}
      </p>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-8">
        <div>
          <div className={`text-xs mb-2 ${isWatering ? "text-blue-200" : "text-gray-600"}`}>
            OPERATION MODE
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              isWatering ? "bg-blue-200 animate-pulse" : "bg-emerald-500"
            }`}></div>
            <span className="font-medium">
              {isWatering ? "Active Irrigation" : "Automatic Eco-Growth"}
            </span>
          </div>
        </div>
        <div>
          <div className={`text-xs mb-2 ${isWatering ? "text-blue-200" : "text-gray-600"}`}>
            {isWatering ? "TIME REMAINING" : "NEXT TASK"}
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              isWatering ? "bg-blue-200" : "bg-gray-400"
            }`}></div>
            <span className="font-medium">
              {isWatering ? `Remaining: ${remainingTime || "12:45"}` : "Scheduled Irrigation (18:00)"}
            </span>
          </div>
        </div>
      </div>

      {/* Temperature - positioned at bottom right */}
      <div className="mt-8 flex items-end justify-between">
        {isWatering && (
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg text-sm font-medium transition-colors">
            VIEW TASK
          </button>
        )}
        <div className="flex items-center gap-4 ml-auto">
          <div>
            <div className={`text-xs mb-1 ${isWatering ? "text-blue-200" : "text-gray-600"}`}>
              Ambient Temp
            </div>
            <div className={`text-3xl font-bold ${isWatering ? "text-white" : "text-gray-900"}`}>
              {temperature.toFixed(2)}°C
            </div>
          </div>
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
            isWatering ? "bg-white/20" : "bg-white"
          }`}>
            <Droplet size={28} className={isWatering ? "text-white" : "text-emerald-600"} />
          </div>
        </div>
      </div>
    </div>
  );
}
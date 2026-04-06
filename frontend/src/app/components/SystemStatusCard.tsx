import { Droplet } from "lucide-react";

interface SystemStatusCardProps {
  mode: "watering" | "monitoring" | "recovering";
  temperature: number;
  timeLabel?: string;
  timeValue?: string;
}

export function SystemStatusCard({ mode, temperature, timeLabel, timeValue }: SystemStatusCardProps) {
  const isWatering = mode === "watering";
  const isRecovering = mode === "recovering";

  let bgClass = "bg-gradient-to-br from-emerald-50 to-green-50 text-gray-900 border border-emerald-200";
  let bgStyle = undefined;
  let badgeClass = "bg-emerald-500 text-white";
  let title = "MONITORING";
  let desc = "The greenhouse environment is currently optimal. All biological parameters are within the healthy threshold.";
  let iconClass = "text-emerald-600";
  let pulseClass = "bg-emerald-500";
  let opMode = "Automatic Eco-Growth";
  let dotClass = "bg-gray-400";

  if (isWatering) {
    bgClass = "bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200";
    badgeClass = "bg-blue-500 text-white";
    title = "WATERING";
    desc = "The system is currently irrigating Node_01. All biological parameters are being optimized.";
    iconClass = "text-blue-600";
    pulseClass = "bg-blue-500 animate-pulse";
    opMode = "Active Irrigation";
    dotClass = "bg-blue-400";
  } else if (isRecovering) {
    bgClass = "bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200";
    badgeClass = "bg-amber-500 text-white";
    title = "RECOVERING";
    desc = "Hệ thống đang tạm ngưng để nước thẩm thấu đều vào rễ. Cảm biến sẽ hoạt động lại sau khi ổn định.";
    iconClass = "text-amber-600";
    pulseClass = "bg-amber-500 animate-pulse";
    opMode = "Penetration Wait";
    dotClass = "bg-amber-400";
  }

  return (
    <div className={`rounded-3xl p-8 relative text-gray-900 ${bgClass}`}>
      {/* Status badge */}
      <div className={`inline-block px-3 py-1 rounded-lg text-xs font-medium mb-6 ${badgeClass}`}>
        SYSTEM STATUS
      </div>

      {/* Title */}
      <h2 className="text-4xl font-bold mb-4">{title}</h2>

      {/* Description */}
      <p className="text-sm leading-relaxed mb-8 max-w-md text-gray-700">
        {desc}
      </p>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-8">
        <div>
          <div className="text-xs mb-2 text-gray-600 uppercase">
            OPERATION MODE
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${pulseClass}`}></div>
            <span className="font-medium">{opMode}</span>
          </div>
        </div>
        <div>
          <div className="text-xs mb-2 text-gray-600 uppercase">
            {timeLabel || "NEXT TASK"}
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${dotClass}`}></div>
            <span className="font-medium">
              {timeValue || "Scheduled Irrigation (18:00)"}
            </span>
          </div>
        </div>
      </div>

      {/* Temperature - positioned at bottom right */}
      <div className="mt-8 flex items-end justify-between">
        <div className="flex items-center gap-4 ml-auto">
          <div>
            <div className="text-xs mb-1 text-gray-600">
              Ambient Temp
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {temperature.toFixed(2)}°C
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white shadow-sm">
            <Droplet size={28} className={iconClass} />
          </div>
        </div>
      </div>
    </div>
  );
}
import { Droplet, CircleStop } from "lucide-react";
import { useState } from "react";

export function EmergencyPumpControl() {
  const [isRunning, setIsRunning] = useState(false);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Emergency<br />Pump<br />Control</h3>
      <p className="text-xs text-gray-600 leading-relaxed mb-6">
        Bypass automated systems for immediate water delivery. Use only in critical physiological stress cases.
      </p>

      <div className="flex gap-3">
        {/* Force Stop */}
        <button
          onClick={() => setIsRunning(false)}
          className={`flex-1 py-6 px-4 rounded-2xl border-2 transition-all ${
            !isRunning
              ? "bg-gray-100 border-gray-300"
              : "bg-white border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <CircleStop size={20} className="text-gray-600" />
          </div>
          <div className="text-sm font-medium text-gray-900">Force<br />Stop</div>
        </button>

        {/* Start Pump */}
        <button
          onClick={() => setIsRunning(true)}
          className={`flex-1 py-6 px-4 rounded-2xl border-2 transition-all ${
            isRunning
              ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/50"
              : "bg-white border-blue-600 hover:bg-blue-50"
          }`}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Droplet
              size={20}
              className={isRunning ? "text-white animate-pulse" : "text-blue-600"}
            />
          </div>
          <div className={`text-sm font-medium ${isRunning ? "text-white" : "text-blue-600"}`}>
            Start<br />Pump<br />Now
          </div>
        </button>
      </div>

      {isRunning && (
        <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <span className="text-xs text-blue-700 font-medium">Emergency pump activated</span>
          </div>
        </div>
      )}
    </div>
  );
}

import { Hourglass } from "lucide-react";

interface RecoveringTimerProps {
  isActive?: boolean;
  remainingSeconds?: number;
  lastTime?: string | null;
}

export function RecoveringTimer({ isActive = true, remainingSeconds = 300, lastTime }: RecoveringTimerProps) {
  const displaySeconds = isActive ? Math.max(0, remainingSeconds) : 0;
  const minutes = Math.floor(displaySeconds / 60);
  const remSec = displaySeconds % 60;

  // Assume a 5-minute (300s) full circle for visual progress max
  const maxSeconds = 300;
  const progress = isActive ? ((maxSeconds - Math.min(displaySeconds, maxSeconds)) / maxSeconds) * 100 : 100;

  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-200">
      <div className={`inline-block px-3 py-1 text-xs font-medium rounded-lg mb-6 ${isActive ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-700"
        }`}>
        ● TRẠNG THÁI: {isActive ? "RECOVERING" : "NON-RECOVERING"}
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        {isActive ? <span className="block">Đang Chờ<br />Thẩm Thấu</span> : 'Chờ Thẩm Thấu'}
      </h2>
      <p className="text-sm text-gray-600 leading-relaxed mb-8">
        {isActive
          ? "Hệ thống đang tạm ngưng để nước thẩm thấu đều vào rễ. Cảm biến sẽ hoạt động lại sau khi ổn định."
          : "Hệ thống hiện không ở trong trạng thái phục hồi. Cảm biến hoạt động bình thường."}
      </p>

      {isActive ? (
        <>
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="#f3f4f6" strokeWidth="8" fill="none" />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#b45309"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${2 * Math.PI * 70 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Hourglass size={40} className="text-amber-700" />
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-5xl font-bold text-amber-900 mb-1">
              {String(minutes).padStart(2, "0")}:{String(remSec).padStart(2, "0")}
            </div>
            <div className="text-sm text-gray-500">CÒN LẠI</div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-8">
          <Hourglass size={48} className="text-gray-300 mb-4" />
          <div className="text-lg font-medium text-gray-700">Last recovering:</div>
          <div className="text-xl font-bold text-gray-900 mt-1">{lastTime || "N/A"}</div>
        </div>
      )}
    </div>
  );
}

import { Hourglass } from "lucide-react";
import { useEffect, useState } from "react";

export function RecoveringTimer() {
  const [seconds, setSeconds] = useState(300); // 5 minutes = 300 seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const progress = ((300 - seconds) / 300) * 100;

  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-200">
      <div className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-lg mb-6">
        ● TRẠNG THÁI: RECOVERING
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-2">Đang Chờ<br />Thẩm Thấu</h2>
      <p className="text-sm text-gray-600 leading-relaxed mb-8">
        Hệ thống đang tạm ngưng để nước thẩm thấu đều vào rễ. Cảm biến sẽ hoạt động lại sau khi ổn định.
      </p>

      <div className="flex items-center justify-center mb-6">
        {/* Circular progress */}
        <div className="relative w-40 h-40">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="#f3f4f6"
              strokeWidth="8"
              fill="none"
            />
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
          {String(minutes).padStart(2, "0")}:{String(remainingSeconds).padStart(2, "0")}
        </div>
        <div className="text-sm text-gray-500">CÒN LẠI</div>
      </div>
    </div>
  );
}

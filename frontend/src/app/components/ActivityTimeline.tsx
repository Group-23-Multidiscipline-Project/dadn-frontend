import { Droplet, CheckCircle, Clock } from "lucide-react";

interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  type: "start" | "complete" | "recovery";
}

export function ActivityTimeline() {
  const events: TimelineEvent[] = [
    {
      id: "1",
      time: "14:00",
      title: "Bật đầu tưới",
      description: "Hệ thống kích hoạt bơm tự động do Độ ẩm thấp (18% < 20%).",
      type: "start",
    },
    {
      id: "2",
      time: "14:15",
      title: "Kết thúc tưới",
      description: "Đã tưới đủ 15 phút. Độ ẩm đạt ngưỡng cần bằng.",
      type: "complete",
    },
    {
      id: "3",
      time: "14:45",
      title: "Kết thúc phục hồi",
      description: "Trạng thái sinh trưởng ổn định, chuyển về chế độ Monitoring.",
      type: "recovery",
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "start":
        return <Droplet size={20} className="text-blue-600" />;
      case "complete":
        return <CheckCircle size={20} className="text-emerald-600" />;
      case "recovery":
        return <Clock size={20} className="text-amber-600" />;
      default:
        return null;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case "start":
        return "bg-blue-100";
      case "complete":
        return "bg-emerald-100";
      case "recovery":
        return "bg-amber-100";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-5 bg-emerald-500 rounded-full"></div>
        <h3 className="font-semibold text-gray-900">Hoạt động gần đây</h3>
      </div>

      <div className="space-y-6 relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200"></div>

        {events.map((event, index) => (
          <div key={event.id} className="flex gap-4 relative">
            <div className="flex flex-col items-center shrink-0">
              <div className={`w-12 h-12 rounded-full ${getIconBg(event.type)} flex items-center justify-center z-10`}>
                {getIcon(event.type)}
              </div>
            </div>
            <div className="flex-1 pt-2">
              <div className="flex items-baseline justify-between mb-1">
                <h4 className="font-medium text-gray-900">{event.title}</h4>
                <span className="text-sm text-blue-600 font-medium">{event.time}</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

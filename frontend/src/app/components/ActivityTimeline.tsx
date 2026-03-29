import { Droplet, CheckCircle, Clock } from "lucide-react";
import { useState, useEffect } from "react";

interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  type: "start" | "complete" | "recovery";
}

export function ActivityTimeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch("/api/event-logs?deviceId=node_01&limit=20");
        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid response format");
        }

        const formattedEvents = data.map((log: any) => {
          let type: "start" | "complete" | "recovery" = "complete";
          let title = "Hoạt động";
          let description = "";

          if (log.action === "start_pump") {
            type = "start";
            title = "Bắt đầu tưới";
            description = `Hệ thống bắt đầu tưới (Trigger: ${log.metadata?.trigger || 'N/A'}).`;
          } else if (log.action === "stop_pump") {
            if (log.state === "RECOVER") {
              type = "recovery";
              title = "Bắt đầu phục hồi";
              description = "Bơm đã tắt, chờ đất ổn định.";
            } else {
              type = "complete";
              title = "Kết thúc tưới";
              description = "Đã tưới xong.";
            }
          } else if (log.state === "RECOVER") {
            type = "recovery";
            title = "Phục hồi";
            description = "Hệ thống đang trong trạng thái phục hồi, chờ đất ổn định.";
          } else if (log.state === "MONITOR") {
            type = "complete";
            title = "Monitoring";
            description = "Trạng thái sinh trưởng ổn định, đang giám sát.";
          }

          return {
            id: log._id || Math.random().toString(),
            time: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            title,
            description,
            type,
          };
        });

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching event logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

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

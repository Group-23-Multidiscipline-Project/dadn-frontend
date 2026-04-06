import { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { MonitoringView } from "./views/MonitoringView";
import { RecoveringView } from "./views/RecoveringView";
import { WateringView } from "./views/WateringView";
import { LogView } from "./views/LogView";
import { useDeviceState } from "./hooks/useDeviceState";

// Helper functions

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function safeFormatTime(iso: string | null) {
  return iso ? formatTime(new Date(iso)) : "N/A";
}

function formatRemaining(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function Root() {
  // Tab state
  const [selectedTab, setSelectedTab] = useState<"monitoring" | "watering" | "recovering">("monitoring");
  const [showLog, setShowLog] = useState(false);
  const [sidebarActive, setSidebarActive] = useState("dashboard");

  // Sensor data
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [soilMoisture, setSoilMoisture] = useState(0);
  const [lightLevel, setLightLevel] = useState(0);
  const [vitality, setVitality] = useState(0); // If you have a real API for vitality/temp, it goes here

  // Chart data for historical view
  const [chartData, setChartData] = useState<Array<{ time: string; humidity: number; light: number }>>([]);

  const [lastUpdate, setLastUpdate] = useState("Waiting for data...");

  // Average sensor data from last 20 polls
  const [avgMoisture, setAvgMoisture] = useState(0);
  const [avgLight, setAvgLight] = useState(0);

  // Poll real-time sensor updates every 5 seconds
  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await fetch("/api/event-logs?limit=100");
        const data = await response.json();

        // Filter events that have sensor data (moisture or humidity, and light)
        const sensorLogs = data.filter((log: any) => 
          (log.moisture !== undefined || log.humidity !== undefined) && log.light !== undefined
        );
        
        // We need exactly the 20 most recent polls for the average
        const recent20 = sensorLogs.slice(0, 20);

        if (recent20.length > 0) {
          // Current values
          const currentLog = recent20[0];
          const currentMoisture = currentLog.moisture !== undefined ? currentLog.moisture : currentLog.humidity;

          setSoilMoisture(currentMoisture);
          setLightLevel(currentLog.light);
          setHumidity(currentMoisture); // Fallback

          // Calculate averages of last 20 polls
          const totalMoisture = recent20.reduce((acc: number, curr: any) => acc + (curr.moisture !== undefined ? curr.moisture : curr.humidity), 0);
          const totalLight = recent20.reduce((acc: number, curr: any) => acc + curr.light, 0);
          
          setAvgMoisture(totalMoisture / recent20.length);
          setAvgLight(totalLight / recent20.length);
          
          setLastUpdate(formatTime(new Date()));

          // Update chart data from latest logs (chronological order)
          const newChartData = recent20.reverse().map((log: any) => ({
            time: formatTime(new Date(log.timestamp || log.createdAt)),
            humidity: log.moisture !== undefined ? log.moisture : log.humidity,
            light: log.light
          }));
          setChartData(newChartData);
        }
      } catch (error) {
        console.error("Failed to fetch sensor data", error);
      }
    };

    fetchSensorData(); // Initial fetch
    const interval = setInterval(fetchSensorData, 5000);

    return () => clearInterval(interval);
  }, []);

  // Hook for API real-time states
  const { currentState, remainingSeconds, lastTimes } = useDeviceState("node_01");

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        activeItem={sidebarActive}
        onItemClick={(item) => {
          setSidebarActive(item);
          if (item === "logs") {
            setShowLog(true);
          } else {
            setShowLog(false);
          }
        }}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          selectedTab={selectedTab}
          onTabChange={(tab) => {
            setSelectedTab(tab);
            setShowLog(false);
            setSidebarActive("dashboard");
          }}
          showHistory={false}
          onHistoryClick={() => setShowLog(!showLog)}
          showTabs={sidebarActive !== "logs"}
        />

        <main className="flex-1 overflow-y-auto p-6">
          {sidebarActive === "logs" ? (
            <LogView
              chartData={chartData}
              humidity={avgMoisture}
              soilMoisture={soilMoisture}
              lightLevel={lightLevel}
              avgLight={avgLight}
            />
          ) : (
            <>
              {selectedTab === "monitoring" && (
                <MonitoringView
                  mode="monitoring"
                  temperature={temperature}
                  soilMoisture={soilMoisture}
                  lightLevel={lightLevel}
                  lastUpdate={lastUpdate}
                  chartData={chartData}
                  humidity={avgMoisture}
                  vitality={vitality}
                  deviceState={currentState}
                  timeLabel={currentState === "MONITOR" ? "REMAINING TIME" : "LAST MONITORING"}
                  timeValue={currentState === "MONITOR"
                    ? `Remaining: ${formatRemaining(remainingSeconds)}`
                    : safeFormatTime(lastTimes["MONITOR"])}
                />
              )}

              {selectedTab === "watering" && (
                <WateringView
                  mode="watering"
                  temperature={temperature}
                  soilMoisture={soilMoisture}
                  lightLevel={lightLevel}
                  lastUpdate={lastUpdate}
                  deviceState={currentState}
                  timeLabel={currentState === "WATERING" ? "TIME REMAINING" : "LAST WATERING"}
                  timeValue={currentState === "WATERING" 
                    ? `Remaining: ${formatRemaining(remainingSeconds)}`
                    : safeFormatTime(lastTimes["WATERING"])}
                />
              )}

              {selectedTab === "recovering" && (
                <RecoveringView
                  temperature={temperature}
                  soilMoisture={soilMoisture}
                  lightLevel={lightLevel}
                  vitality={vitality}
                  lastUpdate={lastUpdate}
                  isRecovering={currentState === "RECOVER"}
                  remainingSeconds={remainingSeconds}
                  lastRecoverTime={safeFormatTime(lastTimes["RECOVER"])}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
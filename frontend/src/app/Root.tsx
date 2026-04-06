import { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { MonitoringView } from "./views/MonitoringView";
import { RecoveringView } from "./views/RecoveringView";
import { WateringView } from "./views/WateringView";
import { LogView } from "./views/LogView";
import { useDeviceState } from "./hooks/useDeviceState";

// Helper functions
function clamp(val: number, min: number, max: number) {
  return Math.min(max, Math.max(min, val));
}

function randomWalk(current: number, step: number, min: number, max: number) {
  return clamp(current + (Math.random() - 0.5) * step * 2, min, max);
}

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
  const initValue = 0;
  const [temperature, setTemperature] = useState(initValue);
  const [humidity, setHumidity] = useState(initValue);
  const [soilMoisture, setSoilMoisture] = useState(initValue);
  const [lightLevel, setLightLevel] = useState(initValue);
  const [vitality, setVitality] = useState(initValue);

  // Chart data for 24h view
  const [chartData, setChartData] = useState<Array<{ time: string; humidity: number; light: number }>>(() => {
    const times = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"];
    return times.map((time) => ({
      time,
      humidity: initValue,
      light: initValue,
    }));
  });

  const [lastUpdate, setLastUpdate] = useState("2 mins ago");

  // Simulate real-time sensor updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newTemp = initValue;
      const newHum = initValue;
      const newSoil = initValue;
      const newLight = initValue;
      const newVitality = initValue;

      setTemperature(newTemp);
      setHumidity(newHum);
      setSoilMoisture(newSoil);
      setLightLevel(newLight);
      setVitality(newVitality);

      // Update last update time
      setLastUpdate("2 mins ago");
    }, 2000);

    return () => clearInterval(interval);
  }, [temperature, humidity, soilMoisture, lightLevel, vitality]);

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
              humidity={humidity}
              soilMoisture={soilMoisture}
              lightLevel={lightLevel}
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
                  humidity={humidity}
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
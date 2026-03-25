import { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { MonitoringView } from "./views/MonitoringView";
import { RecoveringView } from "./views/RecoveringView";
import { WateringView } from "./views/WateringView";
import { LogView } from "./views/LogView";

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

  // Determine watering mode based on soil moisture
  const wateringMode: "watering" | "monitoring" = soilMoisture < 45 ? "watering" : "monitoring";

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
                  mode={wateringMode}
                  temperature={temperature}
                  soilMoisture={soilMoisture}
                  lightLevel={lightLevel}
                  lastUpdate={lastUpdate}
                  chartData={chartData}
                  humidity={humidity}
                  vitality={vitality}
                />
              )}

              {selectedTab === "watering" && (
                <WateringView
                  mode={wateringMode}
                  temperature={temperature}
                  soilMoisture={soilMoisture}
                  lightLevel={lightLevel}
                  lastUpdate={lastUpdate}
                />
              )}

              {selectedTab === "recovering" && (
                <RecoveringView
                  soilMoisture={soilMoisture}
                  lightLevel={lightLevel}
                  vitality={vitality}
                  lastUpdate={lastUpdate}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
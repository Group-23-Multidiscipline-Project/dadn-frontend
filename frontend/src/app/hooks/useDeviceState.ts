import { useState, useEffect } from 'react';

export interface DeviceStateData {
  currentState: string | null;
  remainingSeconds: number;
  lastTimes: Record<string, string | null>;
  loading: boolean;
}

export function useDeviceState(deviceId: string): DeviceStateData {
  const [currentState, setCurrentState] = useState<string | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [lastTimes, setLastTimes] = useState<Record<string, string | null>>({
    MONITOR: null,
    WATERING: null,
    RECOVER: null,
  });
  const [loading, setLoading] = useState(true);

  // Fetch the last time an inactive state occurred
  const fetchLastTime = async (stateName: string) => {
    try {
      const logRes = await fetch(`/api/event-logs?deviceId=${deviceId}&state=${stateName}&limit=1`);
      const logs = await logRes.json();
      if (logs && logs.length > 0) {
        setLastTimes(prev => ({ ...prev, [stateName]: logs[0].timestamp }));
      }
    } catch (e) {
      console.error(`Failed to fetch last time for ${stateName}:`, e);
    }
  };

  useEffect(() => {
    const fetchState = async () => {
      try {
        const res = await fetch(`/api/state/${deviceId}`);
        const data = await res.json();
        
        setCurrentState(prev => {
          // If the state just changed, record the current time as the "last time" for the previous state.
          // This avoids an extra API call.
          if (prev && prev !== data.state) {
            setLastTimes(lt => ({ ...lt, [prev]: new Date().toISOString() }));
          }
          return data.state;
        });
        
        setRemainingSeconds(data.remainingSeconds || 0);
      } catch (e) {
        console.error("Failed to fetch device state:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchState();
    const interval = setInterval(fetchState, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, [deviceId]);

  // Make sure we have the historical last times for any states that currently aren't active
  useEffect(() => {
    if (currentState) {
      if (currentState !== "MONITOR" && !lastTimes["MONITOR"]) {
        fetchLastTime("MONITOR");
      }
      if (currentState !== "WATERING" && !lastTimes["WATERING"]) {
        fetchLastTime("WATERING");
      }
      if (currentState !== "RECOVER" && !lastTimes["RECOVER"]) {
        fetchLastTime("RECOVER");
      }
    }
  }, [currentState, lastTimes, deviceId]);

  return { currentState, remainingSeconds, lastTimes, loading };
}

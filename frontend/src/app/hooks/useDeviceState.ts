import { useState, useEffect } from 'react';

export interface DeviceStateData {
  currentState: string | null;
  remainingSeconds: number;
  lastTimes: Record<string, string | null>;
  loading: boolean;
}

export function useDeviceState(deviceId: string): DeviceStateData {
  // Dùng 1 object duy nhất lưu toàn bộ state để tối ưu re-render
  const [deviceState, setDeviceState] = useState<DeviceStateData>({
    currentState: null,
    remainingSeconds: 0,
    lastTimes: {
      MONITOR: null,
      WATERING: null,
      RECOVER: null,
    },
    loading: true,
  });

  const fetchLastTime = async (stateName: string) => {
    try {
      // Bỏ query t= vì backend chặn param lạ (400 Bad Request), dùng header điều hướng cache thay thế
      const logRes = await fetch(`/api/event-logs?deviceId=${deviceId}&state=${stateName}&limit=1`, {
        headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
      });
      const logs = await logRes.json();
      if (logs && logs.length > 0) {
        setDeviceState(prev => ({
          ...prev,
          lastTimes: { ...prev.lastTimes, [stateName]: logs[0].timestamp }
        }));
      }
    } catch (e) {
      console.error(`Failed to fetch last time for ${stateName}:`, e);
    }
  };

  useEffect(() => {
    let timeoutId: number;

    const fetchState = async () => {
      try {
        const res = await fetch(`/api/state/${deviceId}`, {
          headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
        });
        const data = await res.json();
        
        setDeviceState(prev => {
          let newLastTimes = { ...prev.lastTimes };
          
          // Kiểm tra nếu trạng thái thay đổi
          if (prev.currentState && prev.currentState !== data.state) {
            newLastTimes[prev.currentState] = new Date().toISOString();
          }

          const newRemaining = data.remainingSeconds || 0;

          // SO SÁNH: Chỉ tạo ra object mới (kích hoạt hook re-render) NẾU giá trị polling lấy về khác giá trị cũ
          if (
            prev.currentState !== data.state || 
            prev.remainingSeconds !== newRemaining ||
            prev.loading // Lần đầu tiên load xong cũng render 1 lần
          ) {
            return {
              ...prev,
              currentState: data.state,
              remainingSeconds: newRemaining,
              lastTimes: prev.currentState !== data.state ? newLastTimes : prev.lastTimes,
              loading: false,
            };
          }

          // Trả về prev cũ (bỏ qua không re-render màn hình) nếu chẳng có gì thay đổi
          return prev;
        });

        const isIdle = data.state === "MONITOR";
        timeoutId = window.setTimeout(fetchState, isIdle ? 30000 : 3000);
      } catch (e) {
        console.error("Failed to fetch device state:", e);
        timeoutId = window.setTimeout(fetchState, 30000);
      }
    };

    fetchState();
    return () => window.clearTimeout(timeoutId);
  }, [deviceId]);

  // Bộ đếm đếm ngược siêu mượt
  useEffect(() => {
    const timer = setInterval(() => {
      setDeviceState(prev => {
        if (prev.remainingSeconds > 0) {
          return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Kéo dữ liệu lịch sử nếu thiếu
  useEffect(() => {
    const { currentState, lastTimes } = deviceState;
    if (currentState) {
      if (currentState !== "MONITOR" && !lastTimes["MONITOR"]) fetchLastTime("MONITOR");
      if (currentState !== "WATERING" && !lastTimes["WATERING"]) fetchLastTime("WATERING");
      if (currentState !== "RECOVER" && !lastTimes["RECOVER"]) fetchLastTime("RECOVER");
    }
  }, [deviceState.currentState, deviceState.lastTimes, deviceId]);

  return deviceState;
}

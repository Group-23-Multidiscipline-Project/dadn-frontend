import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface ChartData {
  time: string;
  humidity: number;
  light: number;
}

interface Chart24hProps {
  data: ChartData[];
}

export function Chart24h({ data }: Chart24hProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900">Chi số 24h</h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span className="text-gray-600">Độ ẩm</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
            <span className="text-gray-600">Ánh sáng</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500 mb-4">Theo dõi độ ẩm và cường độ ánh sáng</p>

      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis
            dataKey="time"
            stroke="#9ca3af"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(value: number) => value.toFixed(2)}
          />
          <Line
            type="monotone"
            dataKey="humidity"
            stroke="#2563eb"
            strokeWidth={2.5}
            dot={false}
            name="Độ ẩm"
          />
          <Line
            type="monotone"
            dataKey="light"
            stroke="#f59e0b"
            strokeWidth={2.5}
            dot={false}
            strokeDasharray="5 5"
            name="Ánh sáng"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
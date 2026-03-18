import { Bell, User, Calendar } from "lucide-react";

interface HeaderProps {
  selectedTab: "monitoring" | "watering" | "recovering";
  onTabChange: (tab: "monitoring" | "watering" | "recovering") => void;
  showHistory?: boolean;
  onHistoryClick?: () => void;
  showTabs?: boolean;
}

export function Header({ selectedTab, onTabChange, showHistory = false, onHistoryClick, showTabs = true }: HeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      {/* Top bar */}
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-900">Node_01 Management</h1>
          {showHistory && (
            <button 
              onClick={onHistoryClick}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1.5"
            >
              <Calendar size={12} />
              HISTORY
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
          </button>
          <button className="w-9 h-9 bg-orange-200 rounded-full flex items-center justify-center hover:bg-orange-300 transition-colors">
            <User size={18} className="text-orange-700" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      {showTabs && (
        <div className="px-6 flex items-center gap-2">
          <button
            onClick={() => onTabChange("monitoring")}
            className={`px-4 py-2.5 text-sm font-medium flex items-center gap-2 rounded-t-lg transition-all ${
              selectedTab === "monitoring"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <span className="text-xs">📊</span>
            Monitoring
          </button>
          <button
            onClick={() => onTabChange("watering")}
            className={`px-4 py-2.5 text-sm font-medium flex items-center gap-2 rounded-t-lg transition-all ${
              selectedTab === "watering"
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <span className="text-xs">💧</span>
            Watering
          </button>
          <button
            onClick={() => onTabChange("recovering")}
            className={`px-4 py-2.5 text-sm font-medium flex items-center gap-2 rounded-t-lg transition-all ${
              selectedTab === "recovering"
                ? "bg-amber-400 text-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <span className="text-xs">🌱</span>
            Recovering
          </button>
        </div>
      )}
    </div>
  );
}
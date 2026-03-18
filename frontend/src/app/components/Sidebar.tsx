import { LayoutDashboard, Sliders, Clock, Settings, Leaf } from "lucide-react";

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

export function Sidebar({ activeItem, onItemClick }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "rules", label: "Rules", icon: Sliders },
    { id: "logs", label: "Logs", icon: Clock },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-56 bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
          <Leaf className="text-white" size={24} />
        </div>
        <div>
          <div className="font-semibold text-gray-900">Smart Agriculture</div>
          <div className="text-xs text-gray-500">Node_01</div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all ${
                isActive
                  ? "bg-emerald-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon size={18} />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom status */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-white rounded-xl p-3 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="text-xs font-medium text-gray-700">System Status</span>
          </div>
          <div className="text-xs text-gray-500">● Optimal</div>
        </div>
      </div>
    </aside>
  );
}

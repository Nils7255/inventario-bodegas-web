import {
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  Truck,
  Bell,
  Users,
  BarChart2,
  Warehouse,
  ChevronRight,
  LogOut,
} from "lucide-react";

type Module =
  | "dashboard"
  | "products"
  | "movements"
  | "suppliers"
  | "alerts"
  | "users"
  | "reports";

const navItems: { id: Module; label: string; icon: React.ReactNode; badge?: number }[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { id: "products", label: "Productos", icon: <Package size={18} /> },
  { id: "movements", label: "Movimientos", icon: <ArrowLeftRight size={18} /> },
  { id: "suppliers", label: "Proveedores", icon: <Truck size={18} /> },
  { id: "alerts", label: "Alertas", icon: <Bell size={18} />, badge: 4 },
  { id: "users", label: "Usuarios", icon: <Users size={18} /> },
  { id: "reports", label: "Reportes", icon: <BarChart2 size={18} /> },
];

interface SidebarProps {
  active: Module;
  onSelect: (m: Module) => void;
  user: { name: string; email: string; role: string };
  onLogout: () => void;
}

export function Sidebar({ active, onSelect, user, onLogout }: SidebarProps) {
  return (
    <aside
      className="flex flex-col h-screen w-64 shrink-0"
      style={{ backgroundColor: "#1A3C5E", fontFamily: "Inter, sans-serif" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div
          className="flex items-center justify-center w-9 h-9 rounded-lg"
          style={{ backgroundColor: "#E8861A" }}
        >
          <Warehouse size={18} className="text-white" />
        </div>
        <div>
          <p className="text-white font-semibold leading-tight" style={{ fontSize: 14 }}>
            StockControl
          </p>
          <p className="text-white/50 leading-tight" style={{ fontSize: 11 }}>
            Gestión de Inventario
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group relative"
              style={{
                backgroundColor: isActive ? "rgba(232,134,26,0.15)" : "transparent",
                color: isActive ? "#E8861A" : "rgba(255,255,255,0.65)",
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "rgba(255,255,255,0.07)";
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              }}
            >
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                  style={{ backgroundColor: "#E8861A" }}
                />
              )}
              <span className={isActive ? "text-[#E8861A]" : "text-white/50"}>{item.icon}</span>
              <span className="flex-1 text-left" style={{ fontSize: 14 }}>
                {item.label}
              </span>
              {item.badge && (
                <span
                  className="flex items-center justify-center w-5 h-5 rounded-full text-white"
                  style={{ backgroundColor: "#E8861A", fontSize: 10 }}
                >
                  {item.badge}
                </span>
              )}
              {isActive && <ChevronRight size={14} style={{ color: "#E8861A" }} />}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/10 space-y-2">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold shrink-0"
            style={{ backgroundColor: "#E8861A", fontSize: 12 }}
          >
            {user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white leading-tight truncate" style={{ fontSize: 13 }}>
              {user.name}
            </p>
            <p className="text-white/40 leading-tight" style={{ fontSize: 11 }}>
              {user.role}
            </p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-white/50 hover:text-white hover:bg-white/10"
          style={{ fontSize: 13 }}
        >
          <LogOut size={15} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

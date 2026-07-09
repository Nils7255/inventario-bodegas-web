import { useState } from "react";
import { AlertTriangle, CheckCircle, Bell } from "lucide-react";

interface Alert {
  id: number;
  product: string;
  category: string;
  stock: number;
  minStock: number;
  severity: "Crítico" | "Bajo";
  since: string;
  attended: boolean;
}

const initialAlerts: Alert[] = [
  { id: 1, product: "Arroz Extra 50kg", category: "Abarrotes", stock: 3, minStock: 10, severity: "Crítico", since: "2026-06-09", attended: false },
  { id: 2, product: "Aceite Vegetal 1L", category: "Abarrotes", stock: 8, minStock: 15, severity: "Crítico", since: "2026-06-10", attended: false },
  { id: 3, product: "Detergente Ariel 2kg", category: "Limpieza", stock: 5, minStock: 12, severity: "Bajo", since: "2026-06-10", attended: false },
  { id: 4, product: "Leche Gloria 1L", category: "Lácteos", stock: 11, minStock: 20, severity: "Crítico", since: "2026-06-11", attended: false },
  { id: 5, product: "Papel Higiénico x12", category: "Higiene", stock: 7, minStock: 8, severity: "Bajo", since: "2026-06-11", attended: false },
  { id: 6, product: "Azúcar Blanca 5kg", category: "Abarrotes", stock: 4, minStock: 20, severity: "Crítico", since: "2026-06-08", attended: true },
  { id: 7, product: "Sal Yodada 1kg", category: "Abarrotes", stock: 6, minStock: 15, severity: "Bajo", since: "2026-06-07", attended: true },
];

export function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [filter, setFilter] = useState<"Todos" | "Pendiente" | "Atendida">("Todos");

  function markAttended(id: number) {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, attended: true } : a));
  }

  const displayed = alerts.filter((a) => {
    if (filter === "Pendiente") return !a.attended;
    if (filter === "Atendida") return a.attended;
    return true;
  });

  const pending = alerts.filter((a) => !a.attended);
  const critical = pending.filter((a) => a.severity === "Crítico");

  return (
    <div className="p-6 space-y-5" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-800" style={{ fontSize: 22, fontWeight: 600 }}>Alertas de Stock</h1>
          <p className="text-gray-500 mt-0.5" style={{ fontSize: 14 }}>Productos que requieren reabastecimiento</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg" style={{ backgroundColor: "#FFF3E0" }}>
          <Bell size={16} style={{ color: "#E8861A" }} />
          <span style={{ fontSize: 14, color: "#E8861A", fontWeight: 500 }}>{pending.length} alertas pendientes</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Alertas Críticas", value: critical.length, color: "#DC2626", bg: "#FEF2F2", icon: <AlertTriangle size={20} className="text-red-500" /> },
          { label: "Alertas Bajas", value: pending.filter(a => a.severity === "Bajo").length, color: "#E8861A", bg: "#FFF7ED", icon: <Bell size={20} style={{ color: "#E8861A" }} /> },
          { label: "Atendidas", value: alerts.filter(a => a.attended).length, color: "#059669", bg: "#ECFDF5", icon: <CheckCircle size={20} className="text-green-500" /> },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 px-5 py-4 shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.bg }}>{s.icon}</div>
            <div>
              <p className="text-gray-500" style={{ fontSize: 13 }}>{s.label}</p>
              <p style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["Todos", "Pendiente", "Atendida"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-4 py-2 rounded-lg transition-all"
            style={{ fontSize: 13, backgroundColor: filter === f ? "#1A3C5E" : "#F3F4F6", color: filter === f ? "#fff" : "#6B7280" }}>
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {["Producto", "Categoría", "Stock Actual", "Stock Mínimo", "Déficit", "Severidad", "Desde", "Estado", "Acción"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-gray-500" style={{ fontSize: 12, fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayed.map((a) => (
              <tr key={a.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={14} style={{ color: a.severity === "Crítico" ? "#DC2626" : "#E8861A" }} />
                    <span className="text-gray-800" style={{ fontSize: 13 }}>{a.product}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500" style={{ fontSize: 13 }}>{a.category}</td>
                <td className="px-4 py-3">
                  <span style={{ fontSize: 13, fontWeight: 600, color: a.severity === "Crítico" ? "#DC2626" : "#E8861A" }}>{a.stock}</span>
                </td>
                <td className="px-4 py-3 text-gray-500" style={{ fontSize: 13 }}>{a.minStock}</td>
                <td className="px-4 py-3">
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#DC2626" }}>-{a.minStock - a.stock}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium"
                    style={a.severity === "Crítico" ? { backgroundColor: "#FEE2E2", color: "#DC2626" } : { backgroundColor: "#FFF3E0", color: "#E8861A" }}>
                    {a.severity}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500" style={{ fontSize: 13 }}>{a.since}</td>
                <td className="px-4 py-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium"
                    style={a.attended ? { backgroundColor: "#ECFDF5", color: "#059669" } : { backgroundColor: "#F3F4F6", color: "#6B7280" }}>
                    {a.attended ? "Atendida" : "Pendiente"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {!a.attended && (
                    <button onClick={() => markAttended(a.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: "#059669", fontSize: 12 }}>
                      <CheckCircle size={12} />
                      Marcar atendida
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {displayed.length === 0 && (
          <div className="py-12 text-center text-gray-400" style={{ fontSize: 14 }}>No hay alertas en esta categoría</div>
        )}
      </div>
    </div>
  );
}

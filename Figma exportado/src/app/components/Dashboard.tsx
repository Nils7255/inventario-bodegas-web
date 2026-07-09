import { Package, AlertTriangle, ArrowLeftRight, DollarSign, TrendingUp, TrendingDown } from "lucide-react";

const kpiCards = [
  {
    title: "Total Productos",
    value: "1,248",
    sub: "+12 esta semana",
    icon: <Package size={22} className="text-white" />,
    color: "#1A3C5E",
    trend: "up",
  },
  {
    title: "Stock Crítico",
    value: "23",
    sub: "Requieren atención",
    icon: <AlertTriangle size={22} className="text-white" />,
    color: "#E8861A",
    trend: "down",
  },
  {
    title: "Movimientos Hoy",
    value: "87",
    sub: "52 entradas · 35 salidas",
    icon: <ArrowLeftRight size={22} className="text-white" />,
    color: "#2E7D5E",
    trend: "up",
  },
  {
    title: "Valorización",
    value: "S/ 284,930",
    sub: "+3.2% vs ayer",
    icon: <DollarSign size={22} className="text-white" />,
    color: "#5B3EAD",
    trend: "up",
  },
];

const recentAlerts = [
  { id: 1, product: "Arroz Extra 50kg", category: "Abarrotes", stock: 3, min: 10, status: "Crítico" },
  { id: 2, product: "Aceite Vegetal 1L", category: "Abarrotes", stock: 8, min: 15, status: "Crítico" },
  { id: 3, product: "Detergente Ariel 2kg", category: "Limpieza", stock: 5, min: 12, status: "Bajo" },
  { id: 4, product: "Leche Gloria 1L", category: "Lácteos", stock: 11, min: 20, status: "Crítico" },
  { id: 5, product: "Papel Higiénico x12", category: "Higiene", stock: 7, min: 8, status: "Bajo" },
];

const recentMovements = [
  { id: 1, type: "Entrada", product: "Harina Blanca 25kg", qty: 50, user: "Carlos M.", time: "10:32" },
  { id: 2, type: "Salida", product: "Azúcar Rubia 5kg", qty: 20, user: "Lucía R.", time: "09:15" },
  { id: 3, type: "Entrada", product: "Aceite Vegetal 1L", qty: 100, user: "Admin", time: "08:50" },
  { id: 4, type: "Salida", product: "Leche Gloria 1L", qty: 35, user: "Carlos M.", time: "08:20" },
];

export function Dashboard() {
  return (
    <div className="p-6 space-y-6" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div>
        <h1 className="text-gray-800" style={{ fontSize: 22, fontWeight: 600 }}>
          Dashboard
        </h1>
        <p className="text-gray-500 mt-0.5" style={{ fontSize: 14 }}>
          Resumen general del inventario · Jueves, 11 de junio de 2026
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {kpiCards.map((card, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
          >
            <div className="flex items-start justify-between">
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: card.color }}
              >
                {card.icon}
              </div>
              <span
                className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: card.trend === "up" ? "#ECFDF5" : "#FFF7ED",
                  color: card.trend === "up" ? "#059669" : "#E8861A",
                }}
              >
                {card.trend === "up" ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {card.trend === "up" ? "Alza" : "Alerta"}
              </span>
            </div>
            <p
              className="mt-3 text-gray-800"
              style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.1 }}
            >
              {card.value}
            </p>
            <p className="mt-0.5 text-gray-500" style={{ fontSize: 13 }}>
              {card.title}
            </p>
            <p className="mt-1 text-gray-400" style={{ fontSize: 12 }}>
              {card.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Alerts table */}
        <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-gray-800" style={{ fontSize: 15, fontWeight: 600 }}>
              Alertas de Stock Crítico
            </h2>
            <span
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ backgroundColor: "#FFF3E0", color: "#E8861A" }}
            >
              {recentAlerts.length} alertas
            </span>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                {["Producto", "Categoría", "Stock", "Mínimo", "Estado"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-gray-500"
                    style={{ fontSize: 12, fontWeight: 600 }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentAlerts.map((a, i) => (
                <tr
                  key={a.id}
                  className="border-t border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-5 py-3 text-gray-800" style={{ fontSize: 13 }}>
                    {a.product}
                  </td>
                  <td className="px-5 py-3 text-gray-500" style={{ fontSize: 13 }}>
                    {a.category}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className="font-semibold"
                      style={{
                        fontSize: 13,
                        color: a.stock < a.min * 0.5 ? "#DC2626" : "#E8861A",
                      }}
                    >
                      {a.stock}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500" style={{ fontSize: 13 }}>
                    {a.min}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-medium"
                      style={
                        a.status === "Crítico"
                          ? { backgroundColor: "#FEE2E2", color: "#DC2626" }
                          : { backgroundColor: "#FFF3E0", color: "#E8861A" }
                      }
                    >
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent movements */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-gray-800" style={{ fontSize: 15, fontWeight: 600 }}>
              Movimientos Recientes
            </h2>
          </div>
          <div className="divide-y divide-gray-50">
            {recentMovements.map((m) => (
              <div key={m.id} className="px-5 py-3 flex items-start gap-3">
                <span
                  className="mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                  style={
                    m.type === "Entrada"
                      ? { backgroundColor: "#ECFDF5" }
                      : { backgroundColor: "#FFF7ED" }
                  }
                >
                  <ArrowLeftRight
                    size={11}
                    style={{ color: m.type === "Entrada" ? "#059669" : "#E8861A" }}
                  />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-700 truncate" style={{ fontSize: 13 }}>
                    {m.product}
                  </p>
                  <p className="text-gray-400" style={{ fontSize: 11 }}>
                    {m.type} · {m.qty} u · {m.user}
                  </p>
                </div>
                <span className="text-gray-400 shrink-0" style={{ fontSize: 11 }}>
                  {m.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

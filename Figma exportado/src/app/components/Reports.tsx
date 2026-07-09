import { useState } from "react";
import { Download, Calendar, BarChart2, DollarSign, ArrowDown, ArrowUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const movementsData = [
  { day: "Lun", entradas: 120, salidas: 85 },
  { day: "Mar", entradas: 95, salidas: 110 },
  { day: "Mié", entradas: 150, salidas: 90 },
  { day: "Jue", entradas: 87, salidas: 65 },
  { day: "Vie", entradas: 200, salidas: 155 },
  { day: "Sáb", entradas: 60, salidas: 75 },
  { day: "Dom", entradas: 30, salidas: 20 },
];

const valuationData = [
  { month: "Ene", value: 245000 },
  { month: "Feb", value: 262000 },
  { month: "Mar", value: 258000 },
  { month: "Abr", value: 271000 },
  { month: "May", value: 265000 },
  { month: "Jun", value: 284930 },
];

const movementsReport = [
  { date: "2026-06-11", type: "Entrada", product: "Harina Blanca 25kg", qty: 50, cost: 78.0, total: 3900.0, user: "Admin" },
  { date: "2026-06-11", type: "Salida", product: "Azúcar Rubia 5kg", qty: 20, cost: 22.0, total: 440.0, user: "Carlos M." },
  { date: "2026-06-11", type: "Entrada", product: "Aceite Vegetal 1L", qty: 100, cost: 12.5, total: 1250.0, user: "Admin" },
  { date: "2026-06-10", type: "Salida", product: "Leche Gloria 1L", qty: 35, cost: 4.5, total: 157.5, user: "Lucía R." },
  { date: "2026-06-10", type: "Entrada", product: "Conserva Atún 170g", qty: 200, cost: 5.8, total: 1160.0, user: "Admin" },
  { date: "2026-06-09", type: "Salida", product: "Detergente Ariel 2kg", qty: 15, cost: 28.9, total: 433.5, user: "Carlos M." },
];

const valuationReport = [
  { product: "Arroz Extra 50kg", category: "Abarrotes", stock: 3, cost: 185.0, total: 555.0 },
  { product: "Aceite Vegetal 1L", category: "Abarrotes", stock: 8, cost: 12.5, total: 100.0 },
  { product: "Harina Blanca 25kg", category: "Abarrotes", stock: 45, cost: 78.0, total: 3510.0 },
  { product: "Azúcar Rubia 5kg", category: "Abarrotes", stock: 32, cost: 22.0, total: 704.0 },
  { product: "Leche Gloria 1L", category: "Lácteos", stock: 11, cost: 4.5, total: 49.5 },
  { product: "Conserva Atún 170g", category: "Conservas", stock: 120, cost: 5.8, total: 696.0 },
];

function exportCSV(data: object[], filename: string) {
  const keys = Object.keys(data[0]);
  const rows = [keys.join(","), ...data.map((row) => keys.map((k) => (row as Record<string, unknown>)[k]).join(","))];
  const blob = new Blob([rows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export function Reports() {
  const [tab, setTab] = useState<"movimientos" | "valorizacion">("movimientos");
  const [dateFrom, setDateFrom] = useState("2026-06-01");
  const [dateTo, setDateTo] = useState("2026-06-11");

  const totalEntradas = movementsReport.filter(m => m.type === "Entrada").reduce((a, m) => a + m.total, 0);
  const totalSalidas = movementsReport.filter(m => m.type === "Salida").reduce((a, m) => a + m.total, 0);
  const totalValorizacion = valuationReport.reduce((a, v) => a + v.total, 0);

  return (
    <div className="p-6 space-y-5" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-800" style={{ fontSize: 22, fontWeight: 600 }}>Reportes</h1>
          <p className="text-gray-500 mt-0.5" style={{ fontSize: 14 }}>Análisis de movimientos y valorización del inventario</p>
        </div>
        <button
          onClick={() => exportCSV(tab === "movimientos" ? movementsReport : valuationReport, `reporte_${tab}_${dateFrom}_${dateTo}.csv`)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white hover:opacity-90"
          style={{ backgroundColor: "#1A3C5E", fontSize: 14 }}>
          <Download size={16} /> Exportar CSV
        </button>
      </div>

      {/* Date filters */}
      <div className="bg-white rounded-xl border border-gray-100 px-5 py-4 shadow-sm flex items-center gap-4">
        <Calendar size={16} className="text-gray-400" />
        <span className="text-gray-600" style={{ fontSize: 14 }}>Período:</span>
        <div className="flex items-center gap-2">
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#1A3C5E]" style={{ fontSize: 13 }} />
          <span className="text-gray-400" style={{ fontSize: 13 }}>—</span>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#1A3C5E]" style={{ fontSize: 13 }} />
        </div>
        <button className="px-3 py-2 rounded-lg text-white hover:opacity-90" style={{ backgroundColor: "#1A3C5E", fontSize: 13 }}>
          Aplicar Filtro
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Entradas (período)", value: `S/ ${totalEntradas.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`, icon: <ArrowDown size={18} className="text-green-500" />, bg: "#ECFDF5" },
          { label: "Total Salidas (período)", value: `S/ ${totalSalidas.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`, icon: <ArrowUp size={18} style={{ color: "#E8861A" }} />, bg: "#FFF7ED" },
          { label: "Valorización Total", value: `S/ ${totalValorizacion.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`, icon: <DollarSign size={18} style={{ color: "#1A3C5E" }} />, bg: "#EFF6FF" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 px-5 py-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.bg }}>{s.icon}</div>
            <div>
              <p className="text-gray-500" style={{ fontSize: 12 }}>{s.label}</p>
              <p className="text-gray-800" style={{ fontSize: 18, fontWeight: 700 }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 px-5 py-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={16} style={{ color: "#1A3C5E" }} />
            <h3 className="text-gray-800" style={{ fontSize: 14, fontWeight: 600 }}>Movimientos Semanales</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={movementsData} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="day" style={{ fontSize: 11 }} tick={{ fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis style={{ fontSize: 11 }} tick={{ fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB" }} />
              <Bar dataKey="entradas" fill="#1A3C5E" radius={[3, 3, 0, 0]} name="Entradas" />
              <Bar dataKey="salidas" fill="#E8861A" radius={[3, 3, 0, 0]} name="Salidas" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 px-5 py-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign size={16} style={{ color: "#1A3C5E" }} />
            <h3 className="text-gray-800" style={{ fontSize: 14, fontWeight: 600 }}>Valorización Mensual (S/)</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={valuationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" style={{ fontSize: 11 }} tick={{ fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis style={{ fontSize: 11 }} tick={{ fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB" }} formatter={(v: number) => [`S/ ${v.toLocaleString()}`, "Valorización"]} />
              <Line type="monotone" dataKey="value" stroke="#1A3C5E" strokeWidth={2.5} dot={{ fill: "#1A3C5E", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tab tables */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100">
          {[{ id: "movimientos", label: "Reporte de Movimientos" }, { id: "valorizacion", label: "Reporte de Valorización" }].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id as "movimientos" | "valorizacion")}
              className="px-5 py-4 transition-all"
              style={{
                fontSize: 14, fontWeight: 500,
                color: tab === t.id ? "#1A3C5E" : "#9CA3AF",
                borderBottom: tab === t.id ? "2px solid #1A3C5E" : "2px solid transparent",
              }}>
              {t.label}
            </button>
          ))}
        </div>
        {tab === "movimientos" ? (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Fecha", "Tipo", "Producto", "Cantidad", "Costo Unit.", "Total", "Usuario"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-gray-500" style={{ fontSize: 12, fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {movementsReport.map((m, i) => (
                <tr key={i} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-gray-500" style={{ fontSize: 13 }}>{m.date}</td>
                  <td className="px-5 py-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium"
                      style={m.type === "Entrada" ? { backgroundColor: "#ECFDF5", color: "#059669" } : { backgroundColor: "#FFF7ED", color: "#E8861A" }}>
                      {m.type}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-700" style={{ fontSize: 13 }}>{m.product}</td>
                  <td className="px-5 py-3 text-gray-700 font-medium" style={{ fontSize: 13 }}>{m.qty}</td>
                  <td className="px-5 py-3 text-gray-500" style={{ fontSize: 13 }}>S/ {m.cost.toFixed(2)}</td>
                  <td className="px-5 py-3 text-gray-800 font-semibold" style={{ fontSize: 13 }}>S/ {m.total.toFixed(2)}</td>
                  <td className="px-5 py-3 text-gray-500" style={{ fontSize: 13 }}>{m.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Producto", "Categoría", "Stock", "Costo Unit.", "Valorización"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-gray-500" style={{ fontSize: 12, fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {valuationReport.map((v, i) => (
                <tr key={i} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-gray-700" style={{ fontSize: 13 }}>{v.product}</td>
                  <td className="px-5 py-3 text-gray-500" style={{ fontSize: 13 }}>{v.category}</td>
                  <td className="px-5 py-3 text-gray-700 font-medium" style={{ fontSize: 13 }}>{v.stock}</td>
                  <td className="px-5 py-3 text-gray-500" style={{ fontSize: 13 }}>S/ {v.cost.toFixed(2)}</td>
                  <td className="px-5 py-3 text-gray-800 font-semibold" style={{ fontSize: 13 }}>S/ {v.total.toFixed(2)}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-gray-200 bg-gray-50">
                <td colSpan={4} className="px-5 py-3 text-gray-700 font-semibold" style={{ fontSize: 13 }}>TOTAL VALORIZACIÓN</td>
                <td className="px-5 py-3 font-bold" style={{ fontSize: 14, color: "#1A3C5E" }}>
                  S/ {totalValorizacion.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

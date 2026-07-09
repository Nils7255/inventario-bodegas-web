import { useState } from "react";
import { Plus, X, ArrowDown, ArrowUp, Filter } from "lucide-react";

interface Movement {
  id: number;
  type: "Entrada" | "Salida";
  product: string;
  qty: number;
  date: string;
  supplier: string;
  unitCost: number;
  user: string;
  notes: string;
}

const initialMovements: Movement[] = [
  { id: 1, type: "Entrada", product: "Harina Blanca 25kg", qty: 50, date: "2026-06-11", supplier: "Molinos Peruanos", unitCost: 78.0, user: "Admin", notes: "Pedido mensual" },
  { id: 2, type: "Salida", product: "Azúcar Rubia 5kg", qty: 20, date: "2026-06-11", supplier: "-", unitCost: 22.0, user: "Carlos M.", notes: "Venta directa" },
  { id: 3, type: "Entrada", product: "Aceite Vegetal 1L", qty: 100, date: "2026-06-11", supplier: "Alicorp S.A.", unitCost: 12.5, user: "Admin", notes: "" },
  { id: 4, type: "Salida", product: "Leche Gloria 1L", qty: 35, date: "2026-06-10", supplier: "-", unitCost: 4.5, user: "Lucía R.", notes: "" },
  { id: 5, type: "Entrada", product: "Conserva Atún 170g", qty: 200, date: "2026-06-10", supplier: "Austral Group", unitCost: 5.8, user: "Admin", notes: "Reabastecimiento" },
  { id: 6, type: "Salida", product: "Detergente Ariel 2kg", qty: 15, date: "2026-06-09", supplier: "-", unitCost: 28.9, user: "Carlos M.", notes: "" },
];

const products = ["Harina Blanca 25kg", "Azúcar Rubia 5kg", "Aceite Vegetal 1L", "Leche Gloria 1L", "Conserva Atún 170g", "Detergente Ariel 2kg", "Arroz Extra 50kg"];
const suppliers = ["Molinos Peruanos", "Alicorp S.A.", "Gloria S.A.", "Austral Group", "Distribuidora Lima SAC", "P&G Perú"];

const emptyForm = { type: "Entrada" as "Entrada" | "Salida", product: products[0], qty: "", date: "", supplier: suppliers[0], unitCost: "", notes: "" };

export function Movements() {
  const [movements, setMovements] = useState<Movement[]>(initialMovements);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [typeFilter, setTypeFilter] = useState<"Todos" | "Entrada" | "Salida">("Todos");

  const filtered = movements.filter((m) => typeFilter === "Todos" || m.type === typeFilter);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newId = Math.max(...movements.map((m) => m.id)) + 1;
    setMovements((prev) => [
      {
        id: newId,
        type: form.type,
        product: form.product,
        qty: +form.qty,
        date: form.date,
        supplier: form.type === "Salida" ? "-" : form.supplier,
        unitCost: +form.unitCost,
        user: "Admin",
        notes: form.notes,
      },
      ...prev,
    ]);
    setShowForm(false);
    setForm(emptyForm);
  }

  const totalEntradas = movements.filter((m) => m.type === "Entrada").reduce((a, m) => a + m.qty, 0);
  const totalSalidas = movements.filter((m) => m.type === "Salida").reduce((a, m) => a + m.qty, 0);

  return (
    <div className="p-6 space-y-5" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-800" style={{ fontSize: 22, fontWeight: 600 }}>Movimientos</h1>
          <p className="text-gray-500 mt-0.5" style={{ fontSize: 14 }}>Registro de entradas y salidas de inventario</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "#1A3C5E", fontSize: 14 }}>
          <Plus size={16} /> Nuevo Movimiento
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Movimientos Hoy", value: movements.filter(m => m.date === "2026-06-11").length, color: "#1A3C5E", bg: "#EFF6FF" },
          { label: "Total Entradas", value: totalEntradas + " unidades", color: "#059669", bg: "#ECFDF5" },
          { label: "Total Salidas", value: totalSalidas + " unidades", color: "#E8861A", bg: "#FFF7ED" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 px-5 py-4 shadow-sm">
            <p className="text-gray-500" style={{ fontSize: 13 }}>{s.label}</p>
            <p className="mt-1" style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter size={14} className="text-gray-400" />
        {(["Todos", "Entrada", "Salida"] as const).map((t) => (
          <button key={t} onClick={() => setTypeFilter(t)}
            className="px-3 py-1.5 rounded-lg transition-all"
            style={{ fontSize: 13, backgroundColor: typeFilter === t ? "#1A3C5E" : "#F3F4F6", color: typeFilter === t ? "#fff" : "#6B7280" }}>
            {t}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {["Tipo", "Producto", "Cantidad", "Costo Unit.", "Total", "Proveedor", "Fecha", "Usuario"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-gray-500" style={{ fontSize: 12, fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit"
                    style={m.type === "Entrada"
                      ? { backgroundColor: "#ECFDF5", color: "#059669" }
                      : { backgroundColor: "#FFF7ED", color: "#E8861A" }}>
                    {m.type === "Entrada" ? <ArrowDown size={11} /> : <ArrowUp size={11} />}
                    <span style={{ fontSize: 12 }}>{m.type}</span>
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-700" style={{ fontSize: 13 }}>{m.product}</td>
                <td className="px-4 py-3 text-gray-700 font-medium" style={{ fontSize: 13 }}>{m.qty}</td>
                <td className="px-4 py-3 text-gray-500" style={{ fontSize: 13 }}>S/ {m.unitCost.toFixed(2)}</td>
                <td className="px-4 py-3 text-gray-700 font-medium" style={{ fontSize: 13 }}>S/ {(m.qty * m.unitCost).toFixed(2)}</td>
                <td className="px-4 py-3 text-gray-500" style={{ fontSize: 13 }}>{m.supplier}</td>
                <td className="px-4 py-3 text-gray-500" style={{ fontSize: 13 }}>{m.date}</td>
                <td className="px-4 py-3 text-gray-500" style={{ fontSize: 13 }}>{m.user}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-gray-800" style={{ fontSize: 17, fontWeight: 600 }}>Nuevo Movimiento</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 mb-1.5" style={{ fontSize: 13 }}>Tipo</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "Entrada" | "Salida" })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#1A3C5E] bg-white" style={{ fontSize: 14 }}>
                    <option>Entrada</option>
                    <option>Salida</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 mb-1.5" style={{ fontSize: 13 }}>Producto</label>
                  <select value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#1A3C5E] bg-white" style={{ fontSize: 14 }}>
                    {products.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 mb-1.5" style={{ fontSize: 13 }}>Cantidad</label>
                  <input required type="number" min="1" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#1A3C5E]" style={{ fontSize: 14 }} />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1.5" style={{ fontSize: 13 }}>Costo Unitario (S/)</label>
                  <input required type="number" min="0" step="0.01" value={form.unitCost} onChange={(e) => setForm({ ...form, unitCost: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#1A3C5E]" style={{ fontSize: 14 }} />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1.5" style={{ fontSize: 13 }}>Fecha</label>
                  <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#1A3C5E]" style={{ fontSize: 14 }} />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1.5" style={{ fontSize: 13 }}>Proveedor</label>
                  <select value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#1A3C5E] bg-white" style={{ fontSize: 14 }}
                    disabled={form.type === "Salida"}>
                    {suppliers.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-gray-600 mb-1.5" style={{ fontSize: 13 }}>Notas (opcional)</label>
                  <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#1A3C5E]" style={{ fontSize: 14 }} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50" style={{ fontSize: 14 }}>Cancelar</button>
                <button type="submit" className="px-4 py-2.5 rounded-lg text-white hover:opacity-90" style={{ backgroundColor: "#1A3C5E", fontSize: 14 }}>
                  Registrar Movimiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

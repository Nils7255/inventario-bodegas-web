import { useState } from "react";
import { Plus, X, Truck, Edit2, Trash2, Phone, Mail, MapPin } from "lucide-react";

interface Supplier {
  id: number;
  name: string;
  ruc: string;
  phone: string;
  email: string;
  address: string;
  products: number;
  status: "Activo" | "Inactivo";
}

const initialSuppliers: Supplier[] = [
  { id: 1, name: "Distribuidora Lima SAC", ruc: "20512345678", phone: "01-2345678", email: "ventas@distriblima.com", address: "Av. Argentina 1234, Lima", products: 45, status: "Activo" },
  { id: 2, name: "Alicorp S.A.", ruc: "20100055237", phone: "01-3150800", email: "contacto@alicorp.com", address: "Av. Argentina 4793, Lima", products: 32, status: "Activo" },
  { id: 3, name: "Gloria S.A.", ruc: "20100190797", phone: "01-6136200", email: "ventas@gloria.com.pe", address: "Av. República de Panamá 2461, Lima", products: 18, status: "Activo" },
  { id: 4, name: "Molinos Peruanos", ruc: "20433298882", phone: "01-5610100", email: "info@molinosperu.com", address: "Calle Los Nogales 312, Lima", products: 12, status: "Activo" },
  { id: 5, name: "Austral Group", ruc: "20100151858", phone: "01-2005700", email: "comercial@austral.com.pe", address: "Av. Conquistadores 889, San Isidro", products: 8, status: "Inactivo" },
  { id: 6, name: "P&G Perú", ruc: "20205013648", phone: "01-6110000", email: "ventas@pg.com", address: "Av. El Derby 254, Surco", products: 21, status: "Activo" },
  { id: 7, name: "Kimberly Clark", ruc: "20345678901", phone: "01-6120500", email: "info@kimberly.com.pe", address: "Av. Industrial 452, Ate", products: 14, status: "Activo" },
];

const emptyForm = { name: "", ruc: "", phone: "", email: "", address: "", status: "Activo" as "Activo" | "Inactivo" };

export function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);

  function openNew() { setForm(emptyForm); setEditId(null); setShowForm(true); }
  function openEdit(s: Supplier) {
    setForm({ name: s.name, ruc: s.ruc, phone: s.phone, email: s.email, address: s.address, status: s.status });
    setEditId(s.id); setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editId !== null) {
      setSuppliers((prev) => prev.map((s) => s.id === editId ? { ...s, ...form } : s));
    } else {
      setSuppliers((prev) => [...prev, { id: Math.max(...prev.map(s => s.id)) + 1, ...form, products: 0 }]);
    }
    setShowForm(false);
  }

  return (
    <div className="p-6 space-y-5" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-800" style={{ fontSize: 22, fontWeight: 600 }}>Proveedores</h1>
          <p className="text-gray-500 mt-0.5" style={{ fontSize: 14 }}>{suppliers.length} proveedores registrados</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white hover:opacity-90"
          style={{ backgroundColor: "#1A3C5E", fontSize: 14 }}>
          <Plus size={16} /> Nuevo Proveedor
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Proveedores", value: suppliers.length, color: "#1A3C5E" },
          { label: "Activos", value: suppliers.filter(s => s.status === "Activo").length, color: "#059669" },
          { label: "Inactivos", value: suppliers.filter(s => s.status === "Inactivo").length, color: "#E8861A" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 px-5 py-4 shadow-sm">
            <p className="text-gray-500" style={{ fontSize: 13 }}>{s.label}</p>
            <p className="mt-1" style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {["Proveedor", "RUC", "Contacto", "Dirección", "Productos", "Estado", ""].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-gray-500" style={{ fontSize: 12, fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s) => (
              <tr key={s.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#EFF6FF" }}>
                      <Truck size={14} style={{ color: "#1A3C5E" }} />
                    </div>
                    <span className="text-gray-800" style={{ fontSize: 13, fontWeight: 500 }}>{s.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-500" style={{ fontSize: 13 }}>{s.ruc}</td>
                <td className="px-5 py-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-gray-600" style={{ fontSize: 12 }}>
                      <Phone size={11} className="text-gray-400" />{s.phone}
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500" style={{ fontSize: 12 }}>
                      <Mail size={11} className="text-gray-400" />{s.email}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5 text-gray-500" style={{ fontSize: 13 }}>
                    <MapPin size={12} className="text-gray-400 shrink-0" />
                    <span className="truncate max-w-[160px]">{s.address}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-700 font-medium" style={{ fontSize: 13 }}>{s.products}</td>
                <td className="px-5 py-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium"
                    style={s.status === "Activo" ? { backgroundColor: "#ECFDF5", color: "#059669" } : { backgroundColor: "#F3F4F6", color: "#6B7280" }}>
                    {s.status}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"><Edit2 size={14} /></button>
                    <button onClick={() => setSuppliers(prev => prev.filter(x => x.id !== s.id))} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-gray-800" style={{ fontSize: 17, fontWeight: 600 }}>{editId ? "Editar Proveedor" : "Nuevo Proveedor"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-gray-600 mb-1.5" style={{ fontSize: 13 }}>Nombre / Razón Social</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#1A3C5E]" style={{ fontSize: 14 }} />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1.5" style={{ fontSize: 13 }}>RUC</label>
                  <input required value={form.ruc} onChange={(e) => setForm({ ...form, ruc: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#1A3C5E]" style={{ fontSize: 14 }} maxLength={11} />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1.5" style={{ fontSize: 13 }}>Teléfono</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#1A3C5E]" style={{ fontSize: 14 }} />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1.5" style={{ fontSize: 13 }}>Correo Electrónico</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#1A3C5E]" style={{ fontSize: 14 }} />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1.5" style={{ fontSize: 13 }}>Estado</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "Activo" | "Inactivo" })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#1A3C5E] bg-white" style={{ fontSize: 14 }}>
                    <option>Activo</option>
                    <option>Inactivo</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-gray-600 mb-1.5" style={{ fontSize: 13 }}>Dirección</label>
                  <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#1A3C5E]" style={{ fontSize: 14 }} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50" style={{ fontSize: 14 }}>Cancelar</button>
                <button type="submit" className="px-4 py-2.5 rounded-lg text-white hover:opacity-90" style={{ backgroundColor: "#1A3C5E", fontSize: 14 }}>
                  {editId ? "Guardar Cambios" : "Registrar Proveedor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { Search, Plus, X, Package, Edit2, Trash2 } from "lucide-react";

interface Product {
  id: number;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  unit: string;
  price: number;
  supplier: string;
}

const initialProducts: Product[] = [
  { id: 1, name: "Arroz Extra 50kg", category: "Abarrotes", stock: 3, minStock: 10, unit: "Saco", price: 185.0, supplier: "Distribuidora Lima SAC" },
  { id: 2, name: "Aceite Vegetal 1L", category: "Abarrotes", stock: 8, minStock: 15, unit: "Botella", price: 12.5, supplier: "Alicorp S.A." },
  { id: 3, name: "Harina Blanca 25kg", category: "Abarrotes", stock: 45, minStock: 20, unit: "Saco", price: 78.0, supplier: "Molinos Peruanos" },
  { id: 4, name: "Azúcar Rubia 5kg", category: "Abarrotes", stock: 32, minStock: 25, unit: "Bolsa", price: 22.0, supplier: "Distribuidora Lima SAC" },
  { id: 5, name: "Leche Gloria 1L", category: "Lácteos", stock: 11, minStock: 20, unit: "Caja", price: 4.5, supplier: "Gloria S.A." },
  { id: 6, name: "Detergente Ariel 2kg", category: "Limpieza", stock: 5, minStock: 12, unit: "Bolsa", price: 28.9, supplier: "P&G Perú" },
  { id: 7, name: "Papel Higiénico x12", category: "Higiene", stock: 7, minStock: 8, unit: "Paquete", price: 18.5, supplier: "Kimberly Clark" },
  { id: 8, name: "Shampoo H&S 400ml", category: "Higiene", stock: 24, minStock: 10, unit: "Frasco", price: 19.9, supplier: "P&G Perú" },
  { id: 9, name: "Jabón Bolívar x3", category: "Limpieza", stock: 60, minStock: 30, unit: "Pack", price: 8.5, supplier: "Alicorp S.A." },
  { id: 10, name: "Conserva Atún 170g", category: "Conservas", stock: 120, minStock: 50, unit: "Lata", price: 5.8, supplier: "Austral Group" },
];

const categories = ["Todas", "Abarrotes", "Lácteos", "Limpieza", "Higiene", "Conservas"];

const emptyForm = {
  name: "",
  category: "Abarrotes",
  stock: "",
  minStock: "",
  unit: "",
  price: "",
  supplier: "",
};

export function Products() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("Todas");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "Todas" || p.category === catFilter;
    return matchSearch && matchCat;
  });

  function openNew() {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(true);
  }

  function openEdit(p: Product) {
    setForm({
      name: p.name,
      category: p.category,
      stock: String(p.stock),
      minStock: String(p.minStock),
      unit: p.unit,
      price: String(p.price),
      supplier: p.supplier,
    });
    setEditId(p.id);
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editId !== null) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editId
            ? { ...p, ...form, stock: +form.stock, minStock: +form.minStock, price: +form.price }
            : p
        )
      );
    } else {
      const newId = Math.max(...products.map((p) => p.id)) + 1;
      setProducts((prev) => [
        ...prev,
        {
          id: newId,
          name: form.name,
          category: form.category,
          stock: +form.stock,
          minStock: +form.minStock,
          unit: form.unit,
          price: +form.price,
          supplier: form.supplier,
        },
      ]);
    }
    setShowForm(false);
  }

  function handleDelete(id: number) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  const stockStatus = (p: Product) => {
    if (p.stock <= p.minStock * 0.5) return { label: "Crítico", bg: "#FEE2E2", color: "#DC2626" };
    if (p.stock < p.minStock) return { label: "Bajo", bg: "#FFF3E0", color: "#E8861A" };
    return { label: "Normal", bg: "#ECFDF5", color: "#059669" };
  };

  return (
    <div className="p-6 space-y-5" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-800" style={{ fontSize: 22, fontWeight: 600 }}>Productos</h1>
          <p className="text-gray-500 mt-0.5" style={{ fontSize: 14 }}>{products.length} productos registrados</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#1A3C5E", fontSize: 14 }}
        >
          <Plus size={16} />
          Nuevo Producto
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar producto..."
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-700 outline-none focus:border-[#1A3C5E]"
            style={{ fontSize: 14 }}
          />
        </div>
        <div className="flex gap-1.5">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              className="px-3 py-2 rounded-lg transition-all"
              style={{
                fontSize: 13,
                backgroundColor: catFilter === c ? "#1A3C5E" : "#F3F4F6",
                color: catFilter === c ? "#fff" : "#6B7280",
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {["Nombre", "Categoría", "Stock Actual", "Stock Mínimo", "Precio Unit.", "Estado", ""].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-gray-500" style={{ fontSize: 12, fontWeight: 600 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const st = stockStatus(p);
              return (
                <tr key={p.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Package size={13} style={{ color: "#1A3C5E" }} />
                      </div>
                      <div>
                        <p className="text-gray-800" style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</p>
                        <p className="text-gray-400" style={{ fontSize: 11 }}>{p.unit} · {p.supplier}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-500" style={{ fontSize: 13 }}>{p.category}</td>
                  <td className="px-5 py-3">
                    <span className="font-semibold" style={{ fontSize: 13, color: st.color }}>{p.stock}</span>
                  </td>
                  <td className="px-5 py-3 text-gray-500" style={{ fontSize: 13 }}>{p.minStock}</td>
                  <td className="px-5 py-3 text-gray-700" style={{ fontSize: 13 }}>S/ {p.price.toFixed(2)}</td>
                  <td className="px-5 py-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: st.bg, color: st.color }}>
                      {st.label}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-400" style={{ fontSize: 14 }}>
            No se encontraron productos
          </div>
        )}
      </div>

      {/* Modal form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-gray-800" style={{ fontSize: 17, fontWeight: 600 }}>
                {editId !== null ? "Editar Producto" : "Nuevo Producto"}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-gray-600 mb-1.5" style={{ fontSize: 13 }}>Nombre del Producto</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#1A3C5E]" style={{ fontSize: 14 }} />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1.5" style={{ fontSize: 13 }}>Categoría</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#1A3C5E] bg-white" style={{ fontSize: 14 }}>
                    {["Abarrotes", "Lácteos", "Limpieza", "Higiene", "Conservas"].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 mb-1.5" style={{ fontSize: 13 }}>Unidad de Medida</label>
                  <input required value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#1A3C5E]" style={{ fontSize: 14 }} placeholder="Ej: Caja, Botella..." />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1.5" style={{ fontSize: 13 }}>Stock Actual</label>
                  <input required type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#1A3C5E]" style={{ fontSize: 14 }} />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1.5" style={{ fontSize: 13 }}>Stock Mínimo</label>
                  <input required type="number" min="0" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#1A3C5E]" style={{ fontSize: 14 }} />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1.5" style={{ fontSize: 13 }}>Precio Unitario (S/)</label>
                  <input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#1A3C5E]" style={{ fontSize: 14 }} />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1.5" style={{ fontSize: 13 }}>Proveedor</label>
                  <input value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#1A3C5E]" style={{ fontSize: 14 }} placeholder="Nombre del proveedor" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors" style={{ fontSize: 14 }}>
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2.5 rounded-lg text-white hover:opacity-90 transition-opacity" style={{ backgroundColor: "#1A3C5E", fontSize: 14 }}>
                  {editId !== null ? "Guardar Cambios" : "Crear Producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

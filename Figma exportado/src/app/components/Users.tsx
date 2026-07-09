import { useState } from "react";
import { Plus, X, Edit2, Trash2, Shield, User } from "lucide-react";

interface AppUser {
  id: number;
  name: string;
  email: string;
  role: "Administrador" | "Vendedor";
  phone: string;
  joinDate: string;
  status: "Activo" | "Inactivo";
}

const initialUsers: AppUser[] = [
  { id: 1, name: "Carlos Mendoza", email: "carlos.m@tienda.com", role: "Administrador", phone: "999-111-222", joinDate: "2024-01-15", status: "Activo" },
  { id: 2, name: "Lucía Ramírez", email: "lucia.r@tienda.com", role: "Vendedor", phone: "999-333-444", joinDate: "2024-03-20", status: "Activo" },
  { id: 3, name: "José Torres", email: "jose.t@tienda.com", role: "Vendedor", phone: "999-555-666", joinDate: "2024-06-10", status: "Activo" },
  { id: 4, name: "María García", email: "maria.g@tienda.com", role: "Vendedor", phone: "999-777-888", joinDate: "2025-01-05", status: "Inactivo" },
  { id: 5, name: "Admin General", email: "admin@tienda.com", role: "Administrador", phone: "999-000-001", joinDate: "2023-12-01", status: "Activo" },
];

const emptyForm = { name: "", email: "", role: "Vendedor" as "Administrador" | "Vendedor", phone: "", password: "", status: "Activo" as "Activo" | "Inactivo" };

export function Users() {
  const [users, setUsers] = useState<AppUser[]>(initialUsers);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);

  function openNew() { setForm(emptyForm); setEditId(null); setShowForm(true); }
  function openEdit(u: AppUser) {
    setForm({ name: u.name, email: u.email, role: u.role, phone: u.phone, password: "", status: u.status });
    setEditId(u.id); setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editId !== null) {
      setUsers((prev) => prev.map((u) => u.id === editId ? { ...u, ...form } : u));
    } else {
      setUsers((prev) => [...prev, { id: Math.max(...prev.map(u => u.id)) + 1, ...form, joinDate: "2026-06-11" }]);
    }
    setShowForm(false);
  }

  const initials = (name: string) => name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  const roleColors: Record<string, { bg: string; color: string }> = {
    "Administrador": { bg: "#EFF6FF", color: "#1A3C5E" },
    "Vendedor": { bg: "#F0FDF4", color: "#059669" },
  };

  return (
    <div className="p-6 space-y-5" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-800" style={{ fontSize: 22, fontWeight: 600 }}>Usuarios</h1>
          <p className="text-gray-500 mt-0.5" style={{ fontSize: 14 }}>{users.length} usuarios registrados</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white hover:opacity-90"
          style={{ backgroundColor: "#1A3C5E", fontSize: 14 }}>
          <Plus size={16} /> Nuevo Usuario
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Usuarios", value: users.length, color: "#1A3C5E" },
          { label: "Administradores", value: users.filter(u => u.role === "Administrador").length, color: "#1A3C5E" },
          { label: "Vendedores", value: users.filter(u => u.role === "Vendedor").length, color: "#059669" },
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
              {["Usuario", "Correo", "Rol", "Teléfono", "Fecha Ingreso", "Estado", ""].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-gray-500" style={{ fontSize: 12, fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const rc = roleColors[u.role];
              return (
                <tr key={u.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: u.role === "Administrador" ? "#1A3C5E" : "#059669", fontSize: 12, fontWeight: 600 }}>
                        {initials(u.name)}
                      </div>
                      <span className="text-gray-800" style={{ fontSize: 13, fontWeight: 500 }}>{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-500" style={{ fontSize: 13 }}>{u.email}</td>
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit"
                      style={{ backgroundColor: rc.bg, color: rc.color, fontSize: 12 }}>
                      {u.role === "Administrador" ? <Shield size={11} /> : <User size={11} />}
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500" style={{ fontSize: 13 }}>{u.phone}</td>
                  <td className="px-5 py-3 text-gray-500" style={{ fontSize: 13 }}>{u.joinDate}</td>
                  <td className="px-5 py-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium"
                      style={u.status === "Activo" ? { backgroundColor: "#ECFDF5", color: "#059669" } : { backgroundColor: "#F3F4F6", color: "#6B7280" }}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(u)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"><Edit2 size={14} /></button>
                      <button onClick={() => setUsers(prev => prev.filter(x => x.id !== u.id))} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-gray-800" style={{ fontSize: 17, fontWeight: 600 }}>{editId ? "Editar Usuario" : "Nuevo Usuario"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-gray-600 mb-1.5" style={{ fontSize: 13 }}>Nombre Completo</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#1A3C5E]" style={{ fontSize: 14 }} />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1.5" style={{ fontSize: 13 }}>Correo Electrónico</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#1A3C5E]" style={{ fontSize: 14 }} />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1.5" style={{ fontSize: 13 }}>Teléfono</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#1A3C5E]" style={{ fontSize: 14 }} />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1.5" style={{ fontSize: 13 }}>Rol</label>
                  <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as "Administrador" | "Vendedor" })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#1A3C5E] bg-white" style={{ fontSize: 14 }}>
                    <option>Administrador</option>
                    <option>Vendedor</option>
                  </select>
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
                  <label className="block text-gray-600 mb-1.5" style={{ fontSize: 13 }}>
                    {editId ? "Nueva Contraseña (dejar vacío para no cambiar)" : "Contraseña"}
                  </label>
                  <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required={!editId}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#1A3C5E]" style={{ fontSize: 14 }} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50" style={{ fontSize: 14 }}>Cancelar</button>
                <button type="submit" className="px-4 py-2.5 rounded-lg text-white hover:opacity-90" style={{ backgroundColor: "#1A3C5E", fontSize: 14 }}>
                  {editId ? "Guardar Cambios" : "Crear Usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

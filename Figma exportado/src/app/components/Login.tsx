import { useState } from "react";
import { Eye, EyeOff, Warehouse, Lock, Mail, AlertCircle } from "lucide-react";

const VALID_USERS = [
  { email: "admin@tienda.com", password: "admin123", name: "Admin General", role: "Administrador" },
  { email: "carlos.m@tienda.com", password: "carlos123", name: "Carlos Mendoza", role: "Administrador" },
  { email: "lucia.r@tienda.com", password: "lucia123", name: "Lucía Ramírez", role: "Vendedor" },
];

interface LoginProps {
  onLogin: (user: { name: string; email: string; role: string }) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const match = VALID_USERS.find(
        (u) => u.email === email.trim().toLowerCase() && u.password === password
      );
      if (match) {
        onLogin({ name: match.name, email: match.email, role: match.role });
      } else {
        setError("Correo o contraseña incorrectos. Intente de nuevo.");
      }
      setLoading(false);
    }, 700);
  }

  return (
    <div
      className="min-h-screen w-full flex"
      style={{ fontFamily: "Inter, sans-serif", backgroundColor: "#F0F4F8" }}
    >
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 p-10"
        style={{ backgroundColor: "#1A3C5E" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "#E8861A" }}
          >
            <Warehouse size={20} className="text-white" />
          </div>
          <div>
            <p className="text-white font-semibold" style={{ fontSize: 16 }}>StockControl</p>
            <p className="text-white/50" style={{ fontSize: 12 }}>Gestión de Inventario</p>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-white" style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.2 }}>
              Control total de tu inventario en un solo lugar
            </h2>
            <p className="text-white/60 mt-3" style={{ fontSize: 15, lineHeight: 1.6 }}>
              Gestiona productos, proveedores, movimientos y reportes con precisión y en tiempo real.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: "📦", text: "Seguimiento de stock en tiempo real" },
              { icon: "🔔", text: "Alertas automáticas de stock crítico" },
              { icon: "📊", text: "Reportes detallados y exportables" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <span
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "rgba(255,255,255,0.08)", fontSize: 16 }}
                >
                  {f.icon}
                </span>
                <span className="text-white/70" style={{ fontSize: 14 }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/30" style={{ fontSize: 12 }}>
          © 2026 StockControl · Todos los derechos reservados
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "#1A3C5E" }}
            >
              <Warehouse size={20} className="text-white" />
            </div>
            <p className="font-semibold text-gray-800" style={{ fontSize: 18 }}>StockControl</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="mb-7">
              <h1 className="text-gray-800" style={{ fontSize: 22, fontWeight: 700 }}>
                Iniciar sesión
              </h1>
              <p className="text-gray-500 mt-1" style={{ fontSize: 14 }}>
                Ingresa tus credenciales para acceder al sistema
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-gray-700 mb-1.5" style={{ fontSize: 13, fontWeight: 500 }}>
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    placeholder="correo@empresa.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none transition-colors"
                    style={{
                      fontSize: 14,
                      backgroundColor: "#FAFAFA",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#1A3C5E")}
                    onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-gray-700" style={{ fontSize: 13, fontWeight: 500 }}>
                    Contraseña
                  </label>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    style={{ fontSize: 12 }}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl outline-none transition-colors"
                    style={{
                      fontSize: 14,
                      backgroundColor: "#FAFAFA",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#1A3C5E")}
                    onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
                  style={{ backgroundColor: "#FEF2F2" }}
                >
                  <AlertCircle size={15} style={{ color: "#DC2626", shrink: 0 }} />
                  <span style={{ fontSize: 13, color: "#DC2626" }}>{error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-medium transition-opacity"
                style={{
                  backgroundColor: "#1A3C5E",
                  fontSize: 15,
                  opacity: loading ? 0.75 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Verificando...
                  </span>
                ) : (
                  "Ingresar al sistema"
                )}
              </button>
            </form>

            {/* Demo hint */}
            <div
              className="mt-6 p-4 rounded-xl border"
              style={{ backgroundColor: "#F8FAFF", borderColor: "#DBEAFE" }}
            >
              <p className="text-gray-500 mb-2" style={{ fontSize: 12, fontWeight: 600 }}>
                CREDENCIALES DE PRUEBA
              </p>
              <div className="space-y-1">
                {VALID_USERS.map((u) => (
                  <button
                    key={u.email}
                    type="button"
                    onClick={() => { setEmail(u.email); setPassword(u.password); setError(""); }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors text-left"
                  >
                    <span className="text-gray-700" style={{ fontSize: 12 }}>{u.email}</span>
                    <span
                      className="px-2 py-0.5 rounded-full"
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        backgroundColor: u.role === "Administrador" ? "#EFF6FF" : "#ECFDF5",
                        color: u.role === "Administrador" ? "#1A3C5E" : "#059669",
                      }}
                    >
                      {u.role}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

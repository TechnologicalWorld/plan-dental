import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/hooks/useAuthStore';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuthStore();

  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [show, setShow] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const {roleUpper} = await login({ correo, contrasena });
      navigate('/app/dashboard', { replace: true });
        const firstRole = roleUpper?.[0];

        console.log(roleUpper)
  console.log('GuestGuard - firstRole:', firstRole);

  if (firstRole==="ADMIN"){
      navigate('/app/dashboard', { replace: true });
  }
  if(firstRole==="ODONTOLOGO")
    
    {
      navigate('/app/dashboardOdonto', { replace: true });

    }

    if(firstRole==="PACIENTE"){
      navigate('/app/dashboardPaciente', { replace: true });

    }
  switch (firstRole) {
    case 'ADMIN':
      return <Navigate to="/app/dashboard" replace />;
    
    case 'ODONTOLOGO':
      return <Navigate to="/app/dashboardOdonto" replace />;
    
    case 'ASISTENTE':
      return <Navigate to="/app/asisitente/citas" replace />;
    
    case 'PACIENTE':
      return <Navigate to="/app/dashboardPaciente" replace />;
    
    default:
      return <Navigate to="/app/dashboard" replace />;
  }
    } catch {/* manejado por store */}
  }

  return (
    <div className="min-h-screen grid place-items-center p-4 bg-[#0f625f]">
      <div className="w-full max-w-md rounded-2xl bg-white/5 backdrop-blur-md shadow-2xl shadow-black/20 ring-1 ring-white/10">
        {/* Header */}
        <div className="px-8 pt-8 text-center">
          <div className="flex items-center justify-center gap-3">
            <img
              src="src/LogoPlanDental.svg"
              alt="Plan Dental"
              className="h-9 w-9 rounded-full bg-white/80 p-1"
            />
            <div className="leading-tight">
              <div className="text-teal-100 font-semibold">Plan Dental</div>
              <div className="text-[11px] text-teal-200/80">Consultorio Odontológico</div>
            </div>
          </div>

          <h1 className="mt-6 text-3xl font-semibold text-white drop-shadow-sm">
            Iniciar Sesión
          </h1>
        </div>


        {/* Form */}
        <form onSubmit={onSubmit} className="px-8 pt-6 pb-8 space-y-3">
          {/* Correo */}
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-teal-700/90">
              <Mail size={18} />
            </span>
            <input
              className="w-full rounded-lg border border-teal-300/40 bg-white text-slate-900 pl-10 pr-3 py-2 outline-none focus:ring-2 focus:ring-teal-500/60"
              placeholder="Correo o usuario"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              autoFocus
            />
          </div>

          {/* Contraseña */}
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-teal-700/90">
              <Lock size={18} />
            </span>
            <input
              type={show ? 'text' : 'password'}
              className="w-full rounded-lg border border-teal-300/40 bg-white text-slate-900 pl-10 pr-10 py-2 outline-none focus:ring-2 focus:ring-teal-500/60"
              placeholder="Contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-2.5 text-teal-700/90 hover:opacity-80"
              aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <div className="text-sm rounded bg-red-100 text-red-700 px-3 py-2 border border-red-200">
              {error}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full rounded-lg bg-slate-900 text-white py-2 font-medium hover:bg-slate-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
            type="submit"
          >
            {loading ? 'Entrando…' : 'Iniciar sesión'}
          </button>

          <div className="pt-1 text-center text-xs text-teal-100/80">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="underline hover:no-underline">
              Regístrate
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

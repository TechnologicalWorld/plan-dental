// src/features/auth/pages/RegisterPage.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/shared/hooks/useAuthStore';
import type { RegisterPayload } from '@/types/auth';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading, error } = useAuthStore();

  const [form, setForm] = useState<RegisterPayload>({
    nombre: '',
    paterno: '',
    materno: '',
    fechaNacimiento: '',
    genero: 'M',
    telefono: '',
    contrasena: '',
    correo: '',
    ci: '',
    codigoSeguro: '',
    lugarNacimiento: '',
    domicilio: '',
    fechaIngreso: '',
  });

  function onChange<K extends keyof RegisterPayload>(k: K, v: RegisterPayload[K]) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await register(form); // te deja logueado
    navigate('/app/dashboard', { replace: true });
  }

  return (
    // OJO: PublicLayout ya pone el fondo liso (#0f625f), así que aquí NO ponemos bg oscuro
    <div className="min-h-[calc(100vh-0px)] grid place-items-center p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white/5 backdrop-blur-md shadow-2xl shadow-black/20 ring-1 ring-white/10">
        {/* Header */}
        <div className="px-8 pt-8">
          <h1 className="text-2xl font-semibold text-white">Crear cuenta</h1>
          <p className="mt-1 text-sm text-teal-200/80">Registro de usuario</p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="px-8 pt-6 pb-8 grid gap-3">
          {/* Datos personales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              className="px-3 py-2 rounded-lg border border-teal-300/40 bg-white text-slate-900"
              placeholder="Nombre"
              value={form.nombre}
              onChange={(e) => onChange('nombre', e.target.value)}
            />
            <input
              className="px-3 py-2 rounded-lg border border-teal-300/40 bg-white text-slate-900"
              placeholder="Apellido paterno"
              value={form.paterno}
              onChange={(e) => onChange('paterno', e.target.value)}
            />
            <input
              className="px-3 py-2 rounded-lg border border-teal-300/40 bg-white text-slate-900"
              placeholder="Apellido materno"
              value={form.materno ?? ''}
              onChange={(e) => onChange('materno', e.target.value)}
            />

            {/* Fecha de nacimiento con etiqueta clara */}
            <div className="flex flex-col">

              <input
                type="date"
                aria-label="Fecha de nacimiento"
                className="px-3 py-2 rounded-lg border border-teal-300/40 bg-white text-slate-900"
                value={form.fechaNacimiento}
                onChange={(e) => onChange('fechaNacimiento', e.target.value)}
              />
            </div>

            <select
              className="px-3 py-2 rounded-lg border border-teal-300/40 bg-white text-slate-900"
              value={form.genero}
              onChange={(e) => onChange('genero', e.target.value as 'M' | 'F')}
            >
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
            <input
              className="px-3 py-2 rounded-lg border border-teal-300/40 bg-white text-slate-900"
              placeholder="Teléfono"
              value={form.telefono ?? ''}
              onChange={(e) => onChange('telefono', e.target.value)}
            />
          </div>

          {/* Acceso */}
          <input
            className="px-3 py-2 rounded-lg border border-teal-300/40 bg-white text-slate-900"
            placeholder="Correo"
            value={form.correo}
            onChange={(e) => onChange('correo', e.target.value)}
          />
          <input
            type="password"
            className="px-3 py-2 rounded-lg border border-teal-300/40 bg-white text-slate-900"
            placeholder="Contraseña"
            value={form.contrasena}
            onChange={(e) => onChange('contrasena', e.target.value)}
          />

          {/* Identificación */}
          <input
            className="px-3 py-2 rounded-lg border border-teal-300/40 bg-white text-slate-900"
            placeholder="CI"
            value={form.ci}
            onChange={(e) => onChange('ci', e.target.value)}
          />

          {/* Datos de paciente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              className="px-3 py-2 rounded-lg border border-teal-300/40 bg-white text-slate-900"
              placeholder="Código de seguro"
              value={form.codigoSeguro ?? ''}
              onChange={(e) => onChange('codigoSeguro', e.target.value)}
            />
            <input
              className="px-3 py-2 rounded-lg border border-teal-300/40 bg-white text-slate-900"
              placeholder="Lugar de nacimiento"
              value={form.lugarNacimiento ?? ''}
              onChange={(e) => onChange('lugarNacimiento', e.target.value)}
            />

            <input
              className="px-3 py-2 md:col-span-2 rounded-lg border border-teal-300/40 bg-white text-slate-900"
              placeholder="Domicilio"
              value={form.domicilio ?? ''}
              onChange={(e) => onChange('domicilio', e.target.value)}
            />

            {/* Fecha de ingreso con etiqueta clara */}
            <div className="md:col-span-2 flex flex-col">
              <label className="text-xs text-teal-100/90 mb-1">Fecha de ingreso</label>
              <input
                type="date"
                aria-label="Fecha de ingreso"
                className="px-3 py-2 rounded-lg border border-teal-300/40 bg-white text-slate-900"
                value={form.fechaIngreso}
                onChange={(e) => onChange('fechaIngreso', e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-sm rounded bg-red-100 text-red-700 px-3 py-2 border border-red-200">
              {error}
            </div>
          )}

          <button
            className="w-full rounded-lg bg-slate-900 text-white py-2 font-medium hover:bg-slate-800 transition disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            disabled={loading}
            type="submit"
          >
            {loading ? 'Creando cuenta…' : 'Registrarme'}
          </button>

          <div className="pt-1 text-center text-xs text-teal-100/80">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="underline hover:no-underline">
              Inicia sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

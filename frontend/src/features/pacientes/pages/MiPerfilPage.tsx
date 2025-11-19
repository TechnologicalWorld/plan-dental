import { useEffect, useState } from "react";
import {
  obtenerMiPerfil,
  actualizarMiPerfilDatosPersonales,
  cambiarPasswordPaciente,
  type PacientePerfil,
} from "@/features/pacientes/pacientes.service";

type PersonaForm = {
  nombre: string;
  paterno?: string;
  materno?: string;
  fechaNacimiento?: string;
  genero?: "M" | "F";
  telefono?: string;
  correo?: string;
  direccion?: string;
};

type PasswordForm = {
  current_password: string;
  password: string;
  password_confirmation: string;
};

export default function MiPerfilPage() {
  const [perfil, setPerfil] = useState<PacientePerfil | null>(null);
  const [loading, setLoading] = useState(false);
  const [savingDatos, setSavingDatos] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  const [datosForm, setDatosForm] = useState<PersonaForm>({
    nombre: "",
    paterno: "",
    materno: "",
    fechaNacimiento: "",
    genero: "M",
    telefono: "",
    correo: "",
    direccion: "",
  });

  const [passForm, setPassForm] = useState<PasswordForm>({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  // ===== CARGAR PERFIL =====
  async function cargarPerfil() {
    setLoading(true);
    setError(null);
    try {
      const p = await obtenerMiPerfil();
      console.log("Perfil cargado:", p);
      setPerfil(p);

      setDatosForm({
        nombre: p.usuario?.nombre ?? "",
        paterno: p.usuario?.paterno ?? "",
        materno: p.usuario?.materno ?? "",
        fechaNacimiento: p.usuario?.fechaNacimiento?.slice(0, 10) ?? "",
        genero: p.usuario?.genero ?? "M",
        telefono: p.usuario?.telefono ?? "",
        correo: p.usuario?.correo ?? "",
        direccion: p.usuario?.direccion ?? "",
      });
    } catch (e: any) {
      console.error("Error cargando perfil:", e);
      const errorMessage =
        e?.response?.data?.message ||
        e?.message ||
        "No se pudo cargar tu perfil.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarPerfil();
  }, []);

  function onDatosChange<K extends keyof PersonaForm>(k: K, v: PersonaForm[K]) {
    setDatosForm((s) => ({ ...s, [k]: v }));
  }

  function onPassChange<K extends keyof PasswordForm>(
    k: K,
    v: PasswordForm[K]
  ) {
    setPassForm((s) => ({ ...s, [k]: v }));
  }

  // ===== GUARDAR DATOS PERSONALES =====
  async function guardarDatosPersonales(e: React.FormEvent) {
    e.preventDefault();
    if (!perfil?.usuario?.idUsuario) {
      setError("No se puede identificar tu usuario.");
      return;
    }

    setSavingDatos(true);
    setError(null);
    setOkMsg(null);
    try {
      await actualizarMiPerfilDatosPersonales(
        perfil.usuario.idUsuario,
        datosForm
      );
      setOkMsg("Datos personales actualizados correctamente.");
      await cargarPerfil(); //Recargar para obtener datos actualizados
    } catch (e: any) {
      console.error(e);
      const errorMessage =
        e?.response?.data?.message ||
        e?.message ||
        "Error al actualizar tus datos personales.";
      setError(errorMessage);
    } finally {
      setSavingDatos(false);
    }
  }

  // ===== CAMBIAR CONTRASEÑA =====
  async function cambiarPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!perfil?.usuario?.idUsuario) {
      setError("No se puede identificar tu usuario.");
      return;
    }

    if (!passForm.current_password) {
      setError("Por favor ingresa tu contraseña actual.");
      return;
    }

    if (!passForm.password) {
      setError("Por favor ingresa una nueva contraseña.");
      return;
    }

    if (passForm.password !== passForm.password_confirmation) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (passForm.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setSavingPass(true);
    setError(null);
    setOkMsg(null);
    try {
      await cambiarPasswordPaciente(perfil.usuario.idUsuario, passForm);
      setOkMsg("Contraseña actualizada correctamente.");
      setPassForm({
        current_password: "",
        password: "",
        password_confirmation: "",
      });
    } catch (e: any) {
      console.error(e);
      const errorMessage =
        e?.response?.data?.message ||
        e?.message ||
        "Error al cambiar tu contraseña.";
      setError(errorMessage);
    } finally {
      setSavingPass(false);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Mi Perfil</h1>
        <p className="text-sm opacity-70">
          Gestiona tus datos personales y seguridad de tu cuenta.
        </p>
      </header>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="text-lg">Cargando tu perfil…</div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <div className="text-red-400 text-sm">{error}</div>
        </div>
      )}

      {okMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/50 rounded-lg p-4">
          <div className="text-emerald-400 text-sm">{okMsg}</div>
        </div>
      )}

      {!loading && (
        <>
          {/* === DATOS PERSONALES === */}
          <section className="bg-white/5 rounded-lg p-6">
            <form onSubmit={guardarDatosPersonales}>
              <h2 className="text-lg font-semibold mb-4">Datos personales</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">CI</label>
                  <input
                    className="w-full px-3 py-2 rounded bg-slate-900/60 border border-white/10 text-sm"
                    disabled
                    value={perfil?.usuario?.ci ?? "No disponible"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nombre
                  </label>
                  <input
                    className="w-full px-3 py-2 rounded bg-slate-900/60 border border-white/10 text-sm focus:border-teal-500 focus:outline-none"
                    value={datosForm.nombre}
                    onChange={(e) => onDatosChange("nombre", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Apellido paterno
                  </label>
                  <input
                    className="w-full px-3 py-2 rounded bg-slate-900/60 border border-white/10 text-sm focus:border-teal-500 focus:outline-none"
                    value={datosForm.paterno ?? ""}
                    onChange={(e) => onDatosChange("paterno", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Apellido materno
                  </label>
                  <input
                    className="w-full px-3 py-2 rounded bg-slate-900/60 border border-white/10 text-sm focus:border-teal-500 focus:outline-none"
                    value={datosForm.materno ?? ""}
                    onChange={(e) => onDatosChange("materno", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Teléfono
                  </label>
                  <input
                    className="w-full px-3 py-2 rounded bg-slate-900/60 border border-white/10 text-sm focus:border-teal-500 focus:outline-none"
                    value={datosForm.telefono ?? ""}
                    onChange={(e) => onDatosChange("telefono", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 rounded bg-slate-900/60 border border-white/10 text-sm focus:border-teal-500 focus:outline-none"
                    value={datosForm.correo ?? ""}
                    onChange={(e) => onDatosChange("correo", e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Dirección
                  </label>
                  <input
                    className="w-full px-3 py-2 rounded bg-slate-900/60 border border-white/10 text-sm focus:border-teal-500 focus:outline-none"
                    value={datosForm.direccion ?? ""}
                    onChange={(e) => onDatosChange("direccion", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Fecha de nacimiento
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 rounded bg-slate-900/60 border border-white/10 text-sm focus:border-teal-500 focus:outline-none"
                    value={datosForm.fechaNacimiento ?? ""}
                    onChange={(e) =>
                      onDatosChange("fechaNacimiento", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Género
                  </label>
                  <select
                    className="w-full px-3 py-2 rounded bg-slate-900/60 border border-white/10 text-sm focus:border-teal-500 focus:outline-none"
                    value={datosForm.genero ?? "M"}
                    onChange={(e) =>
                      onDatosChange("genero", e.target.value as "M" | "F")
                    }
                  >
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-4 mt-4 border-t border-white/10">
                <button
                  type="submit"
                  disabled={savingDatos}
                  className="px-4 py-2 rounded bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingDatos ? "Guardando…" : "Guardar cambios"}
                </button>
              </div>
            </form>
          </section>

          {/* === CAMBIAR CONTRASEÑA === */}
          <section className="bg-white/5 rounded-lg p-6">
            <form onSubmit={cambiarPassword}>
              <h2 className="text-lg font-semibold mb-4">Cambiar contraseña</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Contraseña actual
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 rounded bg-slate-900/60 border border-white/10 text-sm focus:border-teal-500 focus:outline-none"
                    value={passForm.current_password}
                    onChange={(e) =>
                      onPassChange("current_password", e.target.value)
                    }
                    placeholder="Ingresa tu contraseña actual"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nueva contraseña
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 rounded bg-slate-900/60 border border-white/10 text-sm focus:border-teal-500 focus:outline-none"
                    value={passForm.password}
                    onChange={(e) => onPassChange("password", e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Confirmar nueva contraseña
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 rounded bg-slate-900/60 border border-white/10 text-sm focus:border-teal-500 focus:outline-none"
                    value={passForm.password_confirmation}
                    onChange={(e) =>
                      onPassChange("password_confirmation", e.target.value)
                    }
                    placeholder="Repite la nueva contraseña"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 mt-4 border-t border-white/10">
                <button
                  type="submit"
                  disabled={savingPass}
                  className="px-4 py-2 rounded bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingPass ? "Actualizando…" : "Actualizar contraseña"}
                </button>
              </div>
            </form>
          </section>
        </>
      )}
    </div>
  );
}

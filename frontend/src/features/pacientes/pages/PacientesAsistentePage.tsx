import { useEffect, useMemo, useState } from "react";

import Modal from "@/shared/ui/Modal";
import { getUsuario } from "@/features/personal/personal.service";
import { Eye } from "lucide-react";

import {
  listarPacientes,
  actualizarEstadoUsuario,
  registrarPaciente,
} from "@/features/pacientes/pacientes.service";
import type { Paciente } from "@/types/paciente";

type RegisterBody = {
  nombre: string;
  paterno: string;
  materno?: string;
  fechaNacimiento?: string;
  genero?: "M" | "F";
  telefono?: string;
  contrasena: string;
  correo: string;
  ci: string;
  codigoSeguro?: string;
  lugarNacimiento?: string;
  domicilio?: string;
  fechaIngreso: string;
  device_name?: string;
};

export default function PacientesAdminListPage() {
  const [items, setItems] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // agregar
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<RegisterBody>({
    nombre: "",
    paterno: "",
    materno: "",
    fechaNacimiento: "",
    genero: "M",
    telefono: "",
    contrasena: "",
    correo: "",
    ci: "",
    codigoSeguro: "",
    lugarNacimiento: "",
    domicilio: "",
    fechaIngreso: "",
  });

  // ver
  const [viewOpen, setViewOpen] = useState(false);
  const [detail, setDetail] = useState<Paciente | null>(null);

  // filtro por estado
  const [filtroEstado, setFiltroEstado] = useState<
    "todos" | "activo" | "inactivo"
  >("todos");

  function onChange<K extends keyof RegisterBody>(k: K, v: RegisterBody[K]) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  async function cargar() {
    setLoading(true);
    try {
      const { data } = await listarPacientes();
      const arr = (data?.data ?? data) as Paciente[];

      // Filtrar duplicados por ID para evitar keys no únicas
      const uniqueArr = Array.from(
        new Map(arr.map((item) => [item.idUsuario_Paciente, item])).values()
      );
      setItems(uniqueArr);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  // 🔒 Bloquear scroll de la página cuando algún modal esté abierto
  useEffect(() => {
    const anyModalOpen = open || viewOpen;
    if (anyModalOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open, viewOpen]);

  const rows = useMemo(() => {
    let lista = [...items];

    // filtro de estados
    if (filtroEstado !== "todos") {
      const estadoBool = filtroEstado === "activo";
      lista = lista.filter((p) => p.usuario?.estado === estadoBool);
    }

    // filtro de búsqueda
    const q = search.trim().toLowerCase();
    if (q) {
      lista = lista.filter((p) => {
        const u = p.usuario;
        return [u?.ci, u?.nombre, u?.paterno, u?.correo, u?.telefono]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q));
      });
    }
    return lista;
  }, [items, filtroEstado, search]);

  async function toggleEstado(p: Paciente) {
    const idU = p.usuario?.idUsuario ?? p.idUsuario_Paciente;
    if (!idU) return;
    const nuevo = !(p.usuario?.estado ?? false);
    await actualizarEstadoUsuario(idU, nuevo);
    setItems((prev) =>
      prev.map((it) =>
        it.idUsuario_Paciente === p.idUsuario_Paciente
          ? { ...it, usuario: { ...it.usuario, estado: nuevo } }
          : it
      )
    );
  }

  async function crearPaciente(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await registrarPaciente(form);
      setOpen(false);
      setForm({
        nombre: "",
        paterno: "",
        materno: "",
        fechaNacimiento: "",
        genero: "M",
        telefono: "",
        contrasena: "",
        correo: "",
        ci: "",
        codigoSeguro: "",
        lugarNacimiento: "",
        domicilio: "",
        fechaIngreso: "",
      });
      await cargar();
    } finally {
      setSaving(false);
    }
  }

  // ---- Ver
  async function ver(p: Paciente) {
    const idU = p.usuario?.idUsuario ?? p.idUsuario_Paciente;
    if (!idU) return;
    const full = await getUsuario(idU);
    const combinedDetail: Paciente = {
      ...p,
      usuario: {
        ...p.usuario,
        ...(full?.data ?? full),
      },
    };
    setDetail(combinedDetail);
    setViewOpen(true);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-50">
            Gestión de Pacientes
          </h1>
          <p className="text-sm text-slate-400">
            Lista, búsqueda, alta y cambio de estado.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {/* Filtro por estado */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="filtro"
              className="text-sm font-medium text-slate-200"
            >
              Estado
            </label>
            <select
              id="filtro"
              value={filtroEstado}
              onChange={(e) =>
                setFiltroEstado(
                  e.target.value as "todos" | "activo" | "inactivo"
                )
              }
              className="px-3 py-2 rounded-lg bg-slate-900 border border-teal-500/60 text-sm text-slate-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="todos">Todos</option>
              <option value="activo">Activos</option>
              <option value="inactivo">Inactivos</option>
            </select>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium shadow-sm"
          >
            Agregar Paciente
          </button>
        </div>
      </header>

      {/* Búsqueda */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Buscar por CI, nombre o correo…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {loading && (
          <span className="text-sm text-slate-400">Cargando…</span>
        )}
      </div>

      {/* Tabla */}
      <div className="overflow-auto rounded-xl border border-white/10 bg-slate-900/40">
        <table className="w-full text-sm">
          <thead className="bg-slate-900/80">
            <tr>
              <th className="text-left p-3 text-slate-300 font-medium">CI</th>
              <th className="text-left p-3 text-slate-300 font-medium">
                Nombre
              </th>
              <th className="text-left p-3 text-slate-300 font-medium">
                Teléfono
              </th>
              <th className="text-left p-3 text-slate-300 font-medium">
                Estado
              </th>
              <th className="text-left p-3 text-slate-300 font-medium">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => {
              const u = p.usuario ?? ({} as Paciente["usuario"]);
              return (
                <tr
                  key={p.idUsuario_Paciente}
                  className="border-t border-white/10 hover:bg-slate-800/60 transition-colors"
                >
                  <td className="p-3 text-slate-100">{u?.ci ?? "-"}</td>
                  <td className="p-3 text-slate-100">
                    {[u?.nombre, u?.paterno, u?.materno]
                      .filter(Boolean)
                      .join(" ") || "-"}
                  </td>
                  <td className="p-3 text-slate-100">
                    {u?.telefono ?? "-"}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => toggleEstado(p)}
                      className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
                        u?.estado ? "bg-green-600" : "bg-slate-600"
                      }`}
                    >
                      {u?.estado ? "Activo" : "Inactivo"}
                    </button>
                  </td>
                  <td className="p-3 flex items-center gap-2">
                    <button
                      title="Ver"
                      onClick={() => ver(p)}
                      className="p-1.5 rounded-full hover:bg-slate-700 text-slate-200"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && !loading && (
              <tr>
                <td
                  className="p-4 text-center text-slate-400"
                  colSpan={5}
                >
                  Sin resultados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ----- Modal AGREGAR ----- */}
      <Modal open={open} onClose={() => setOpen(false)} title="Agregar Paciente">
        <form onSubmit={crearPaciente} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="CI"
              value={form.ci}
              onChange={(e) => onChange("ci", e.target.value)}
            />
            <input
              className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Nombre"
              value={form.nombre}
              onChange={(e) => onChange("nombre", e.target.value)}
            />
            <input
              className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Paterno"
              value={form.paterno ?? ""}
              onChange={(e) => onChange("paterno", e.target.value)}
            />
            <input
              className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Materno"
              value={form.materno ?? ""}
              onChange={(e) => onChange("materno", e.target.value)}
            />

            <div className="md:col-span-2 space-y-1">
              <span className="text-xs font-medium text-slate-300">
                Fecha de nacimiento
              </span>
              <input
                type="date"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={form.fechaNacimiento ?? ""}
                onChange={(e) =>
                  onChange("fechaNacimiento", e.target.value)
                }
              />
            </div>

            <select
              className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={form.genero ?? "M"}
              onChange={(e) =>
                onChange("genero", e.target.value as "M" | "F")
              }
            >
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
            <input
              className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Teléfono"
              value={form.telefono ?? ""}
              onChange={(e) => onChange("telefono", e.target.value)}
            />

            <input
              className="md:col-span-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Correo"
              value={form.correo}
              onChange={(e) => onChange("correo", e.target.value)}
            />
            <input
              type="password"
              className="md:col-span-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Contraseña"
              value={form.contrasena}
              onChange={(e) => onChange("contrasena", e.target.value)}
            />

            <input
              className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Código de seguro"
              value={form.codigoSeguro ?? ""}
              onChange={(e) =>
                onChange("codigoSeguro", e.target.value)
              }
            />
            <input
              className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Lugar de nacimiento"
              value={form.lugarNacimiento ?? ""}
              onChange={(e) =>
                onChange("lugarNacimiento", e.target.value)
              }
            />

            <input
              className="md:col-span-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Domicilio"
              value={form.domicilio ?? ""}
              onChange={(e) => onChange("domicilio", e.target.value)}
            />

            <div className="md:col-span-2 space-y-1">
              <span className="text-xs font-medium text-slate-300">
                Fecha de ingreso
              </span>
              <input
                type="date"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={form.fechaIngreso}
                onChange={(e) => onChange("fechaIngreso", e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 text-sm"
            >
              Cancelar
            </button>
            <button
              disabled={saving}
              className="px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Guardando…" : "Registrar"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ----- Modal VER ----- */}
      <Modal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Detalle de paciente"
      >
        {!detail ? (
          <div className="text-slate-200">Cargando…</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-100">
            <div>
              <span className="font-medium text-slate-300">CI:</span>{" "}
              {detail.usuario?.ci ?? "-"}
            </div>
            <div>
              <span className="font-medium text-slate-300">Nombre:</span>{" "}
              {detail.usuario?.nombre ?? "-"}
            </div>
            <div>
              <span className="font-medium text-slate-300">Paterno:</span>{" "}
              {detail.usuario?.paterno ?? "-"}
            </div>
            <div>
              <span className="font-medium text-slate-300">Materno:</span>{" "}
              {detail.usuario?.materno ?? "-"}
            </div>
            <div>
              <span className="font-medium text-slate-300">
                Nacimiento:
              </span>{" "}
              {detail.usuario?.fechaNacimiento?.slice(0, 10) ?? "-"}
            </div>
            <div>
              <span className="font-medium text-slate-300">Género:</span>{" "}
              {detail.usuario?.genero ?? "-"}
            </div>
            <div>
              <span className="font-medium text-slate-300">
                Teléfono:
              </span>{" "}
              {detail.usuario?.telefono ?? "-"}
            </div>
            <div>
              <span className="font-medium text-slate-300">Correo:</span>{" "}
              {detail.usuario?.correo ?? "-"}
            </div>
            <div>
              <span className="font-medium text-slate-300">
                Código Seguro:
              </span>{" "}
              {detail.codigoSeguro ?? "-"}
            </div>
            <div>
              <span className="font-medium text-slate-300">
                Lugar Nacimiento:
              </span>{" "}
              {detail.lugarNacimiento ?? "-"}
            </div>
            <div className="md:col-span-2">
              <span className="font-medium text-slate-300">
                Dirección:
              </span>{" "}
              {detail.domicilio ?? "-"}
            </div>
            <div>
              <span className="font-medium text-slate-300">Estado:</span>{" "}
              {detail.usuario?.estado ? "Activo" : "Inactivo"}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

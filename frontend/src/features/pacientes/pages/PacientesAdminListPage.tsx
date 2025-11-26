import { useEffect, useMemo, useState } from "react";
import api from "@/shared/api/apiClient";
import Modal from "@/shared/ui/Modal";
import ConfirmDialog from "@/shared/ui/ConfirmDialog";
import {
  getUsuario,
  updateUsuario,
  deleteUsuario,
} from "@/features/personal/personal.service";
import { Eye, Pencil, Trash2 } from "lucide-react";

type PacienteItem = {
  idUsuario_Paciente: number;
  codigoSeguro?: string;
  lugarNacimiento?: string;
  domicilio?: string;
  fechaIngreso?: string;
  usuario?: {
    idUsuario: number;
    ci?: string;
    nombre: string;
    paterno?: string;
    materno?: string;
    telefono?: string;
    correo?: string;
    estado?: boolean;
  };
};

type RegisterBody = {
  nombre: string;
  paterno?: string;
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

function onlyDate(d?: string) {
  return d ? String(d).split("T")[0] : d;
}

export default function PacientesAdminListPage() {
  const [items, setItems] = useState<PacienteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [filtroEstado, setFiltroEstado] = useState<
    "todos" | "activo" | "inactivo"
  >("todos");

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

  // ver/editar/eliminar
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<any>(null);
  const [edit, setEdit] = useState<
    Partial<{
      ci: string;
      nombre: string;
      paterno?: string;
      materno?: string;
      fechaNacimiento?: string;
      genero?: "M" | "F";
      telefono?: string;
      correo?: string;
      direccion?: string;
      estado?: boolean;
    }>
  >({});

  function onChange<K extends keyof RegisterBody>(k: K, v: RegisterBody[K]) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  async function cargar() {
    setLoading(true);
    try {
      const { data } = await api.get("/pacientes");
      const arr = (data?.data ?? data) as PacienteItem[];
      setItems(Array.isArray(arr) ? arr : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  useEffect(() => {
    const anyModalOpen = open || viewOpen || editOpen || delOpen;
    if (anyModalOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open, viewOpen, editOpen, delOpen]);

  const rows = useMemo(() => {
    let lista = [...items];

    // filtro por estado
    if (filtroEstado !== "todos") {
      const estadoBool = filtroEstado === "activo";
      lista = lista.filter((p) => p.usuario?.estado === estadoBool);
    }

    // filtro de búsqueda
    const q = search.trim().toLowerCase();
    if (!q) return lista;

    return lista.filter((p) => {
      const u = p.usuario;
      return [u?.ci, u?.nombre, u?.paterno, u?.correo, u?.telefono]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [items, filtroEstado, search]);

  async function toggleEstado(p: PacienteItem) {
    const idU = p.usuario?.idUsuario ?? p.idUsuario_Paciente;
    if (!idU) return;
    const nuevo = !(p.usuario?.estado ?? false);
    await api.put(`/usuarios/${idU}`, { estado: nuevo });
    setItems((prev) =>
      prev.map((it) =>
        it.idUsuario_Paciente === p.idUsuario_Paciente
          ? {
              ...it,
              usuario: it.usuario
                ? { ...it.usuario, estado: nuevo }
                : it.usuario,
            }
          : it
      )
    );
  }

  async function crearPaciente(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const body = { ...form, device_name: "react-app" };
      await api.post("/register", body);
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

  // ---- Ver / Editar / Borrar ----
  async function ver(p: PacienteItem) {
    const idU = p.usuario?.idUsuario ?? p.idUsuario_Paciente;
    if (!idU) return;
    setSelectedId(idU);
    const full = await getUsuario(idU);
    setDetail(full?.data ?? full);
    setViewOpen(true);
  }

  async function abrirEditar(p: PacienteItem) {
    const idU = p.usuario?.idUsuario ?? p.idUsuario_Paciente;
    if (!idU) return;
    setSelectedId(idU);
    const full = await getUsuario(idU);
    const d = (full?.data ?? full) as any;
    setEdit({
      ci: d.ci ?? "",
      nombre: d.nombre ?? "",
      paterno: d.paterno ?? "",
      materno: d.materno ?? "",
      fechaNacimiento: d.fechaNacimiento?.slice(0, 10) ?? "",
      genero: d.genero ?? "M",
      telefono: d.telefono ?? "",
      correo: d.correo ?? "",
      direccion: d.direccion ?? "",
      estado: d.estado ?? true,
    });
    setEditOpen(true);
  }

  async function guardarEdicion() {
    if (!selectedId) return;
    const res = await updateUsuario(selectedId, { ...edit });
    const updated = res?.data ?? res;

    setItems((prev) =>
      prev.map((it) => {
        const isThis =
          (it.usuario?.idUsuario ?? it.idUsuario_Paciente) === selectedId;
        if (!isThis) return it;
        const u = it.usuario ?? { idUsuario: selectedId };
        return {
          ...it,
          usuario: {
            ...u,
            ci: updated.ci,
            nombre: updated.nombre,
            paterno: updated.paterno,
            materno: updated.materno,
            correo: updated.correo,
            telefono: updated.telefono,
            estado: updated.estado,
            idUsuario: selectedId,
          },
        };
      })
    );
    setEditOpen(false);
  }

  function abrirEliminar(p: PacienteItem) {
    const idU = p.usuario?.idUsuario ?? p.idUsuario_Paciente;
    setSelectedId(idU ?? null);
    setDelOpen(true);
  }

  async function confirmarEliminar() {
    if (!selectedId) return;
    await deleteUsuario(selectedId);
    setItems((prev) =>
      prev.filter(
        (it) =>
          (it.usuario?.idUsuario ?? it.idUsuario_Paciente) !== selectedId
      )
    );
    setDelOpen(false);
  }

  return (
    <div className="space-y-4">
      {/* HEADER */}
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
          {/* Filtro estado */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-200">
              Estado
            </span>
            <select
              value={filtroEstado}
              onChange={(e) =>
                setFiltroEstado(
                  e.target.value as "todos" | "activo" | "inactivo"
                )
              }
              className="px-3 py-2 rounded-lg bg-slate-900 border border-teal-500/70 text-slate-50 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
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

      {/* BUSCADOR */}
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

      {/* TABLA */}
      <div className="overflow-auto rounded-xl border border-white/10 bg-slate-900/40">
        <table className="w-full text-sm">
          <thead className="bg-slate-900/80">
            <tr>
              <th className="text-left p-3 text-slate-300 font-medium">
                CI
              </th>
              <th className="text-left p-3 text-slate-300 font-medium">
                Nombre
              </th>
              <th className="text-left p-3 text-slate-300 font-medium">
                Fecha ingreso
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
              const u = p.usuario ?? ({} as PacienteItem["usuario"]);
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
                    {onlyDate(p.fechaIngreso) ?? "-"}
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
                    <button
                      title="Editar"
                      onClick={() => abrirEditar(p)}
                      className="p-1.5 rounded-full hover:bg-slate-700 text-slate-200"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      title="Eliminar"
                      onClick={() => abrirEliminar(p)}
                      className="p-1.5 rounded-full hover:bg-slate-800 text-red-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && !loading && (
              <tr>
                <td
                  className="p-4 text-center text-slate-400"
                  colSpan={6}
                >
                  Sin resultados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ----- MODAL AGREGAR ----- */}
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

      {/* ----- MODAL VER ----- */}
      <Modal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Detalle de paciente"
        widthClass="max-w-2xl"
      >
        {!detail ? (
          <div className="text-slate-200">Cargando…</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-100">
            <div>
              <span className="font-medium text-slate-300">CI:</span>{" "}
              {detail.ci ?? "-"}
            </div>
            <div>
              <span className="font-medium text-slate-300">Nombre:</span>{" "}
              {detail.nombre ?? "-"}
            </div>
            <div>
              <span className="font-medium text-slate-300">Paterno:</span>{" "}
              {detail.paterno ?? "-"}
            </div>
            <div>
              <span className="font-medium text-slate-300">Materno:</span>{" "}
              {detail.materno ?? "-"}
            </div>
            <div>
              <span className="font-medium text-slate-300">
                Nacimiento:
              </span>{" "}
              {detail.fechaNacimiento?.slice(0, 10) ?? "-"}
            </div>
            <div>
              <span className="font-medium text-slate-300">Género:</span>{" "}
              {detail.genero ?? "-"}
            </div>
            <div>
              <span className="font-medium text-slate-300">
                Teléfono:
              </span>{" "}
              {detail.telefono ?? "-"}
            </div>
            <div>
              <span className="font-medium text-slate-300">Correo:</span>{" "}
              {detail.correo ?? "-"}
            </div>
            <div className="md:col-span-2">
              <span className="font-medium text-slate-300">
                Dirección:
              </span>{" "}
              {detail.direccion ?? "-"}
            </div>
            <div>
              <span className="font-medium text-slate-300">Estado:</span>{" "}
              {detail.estado ? "Activo" : "Inactivo"}
            </div>
          </div>
        )}
      </Modal>

      {/* ----- MODAL EDITAR ----- */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Editar paciente"
        widthClass="max-w-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="CI"
            value={edit.ci ?? ""}
            onChange={(e) => setEdit((s) => ({ ...s, ci: e.target.value }))}
          />
          <input
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Nombre"
            value={edit.nombre ?? ""}
            onChange={(e) =>
              setEdit((s) => ({ ...s, nombre: e.target.value }))
            }
          />
          <input
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Paterno"
            value={edit.paterno ?? ""}
            onChange={(e) =>
              setEdit((s) => ({ ...s, paterno: e.target.value }))
            }
          />
          <input
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Materno"
            value={edit.materno ?? ""}
            onChange={(e) =>
              setEdit((s) => ({ ...s, materno: e.target.value }))
            }
          />

          <div className="md:col-span-2 space-y-1">
            <span className="text-xs font-medium text-slate-300">
              Fecha de nacimiento
            </span>
            <input
              type="date"
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={edit.fechaNacimiento ?? ""}
              onChange={(e) =>
                setEdit((s) => ({ ...s, fechaNacimiento: e.target.value }))
              }
            />
          </div>

          <select
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={edit.genero ?? "M"}
            onChange={(e) =>
              setEdit((s) => ({ ...s, genero: e.target.value as "M" | "F" }))
            }
          >
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>

          <input
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Teléfono"
            value={edit.telefono ?? ""}
            onChange={(e) =>
              setEdit((s) => ({ ...s, telefono: e.target.value }))
            }
          />
          <input
            className="md:col-span-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Correo"
            value={edit.correo ?? ""}
            onChange={(e) =>
              setEdit((s) => ({ ...s, correo: e.target.value }))
            }
          />
          <input
            className="md:col-span-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Dirección"
            value={edit.direccion ?? ""}
            onChange={(e) =>
              setEdit((s) => ({ ...s, direccion: e.target.value }))
            }
          />
        </div>

        <div className="mt-4 flex justify-end gap-2 border-t border-slate-800 pt-3">
          <button
            onClick={() => setEditOpen(false)}
            className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={guardarEdicion}
            className="px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium"
          >
            Guardar
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={delOpen}
        onClose={() => setDelOpen(false)}
        title="Eliminar paciente"
        message="Esta acción eliminará al usuario y su cuenta de paciente."
        onConfirm={confirmarEliminar}
      />
    </div>
  );
}
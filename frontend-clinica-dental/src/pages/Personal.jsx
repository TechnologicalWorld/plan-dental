import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Stack,
  Chip,
  Toolbar,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";

import { Add, Delete, Edit } from "@mui/icons-material";
import {
  getPersonal,
  createPersonal,
  updatePersonal,
  deletePersonal,
} from "../services/personalService";
import { testUsuarios } from "../services/testUser";
const ESPECIALIDADES = ["Odontólogo", "Asistente"];
const HORARIOS = ["mañana", "tarde", "completo"];
const ESTADOS = ["Activo", "Inactivo"];

export default function Personal() {
  console.log(testUsuarios());
  
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dialog form
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    ci: "",
    especialidad: "",
    horario: "",
    estado: "Activo",
  });

  // Confirm delete
  const [confirmId, setConfirmId] = useState(null);

  // Feedback
  const [toast, setToast] = useState({ open: false, msg: "", sev: "success" });

  const load = async () => {
    try {
      setLoading(true);
      const data = await getPersonal();
      setRows(data);
    } catch (e) {
      setToast({ open: true, msg: e.message, sev: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleOpenNew = () => {
    setEditingId(null);
    setForm({
      nombre: "",
      ci: "",
      especialidad: "",
      horario: "",
      estado: "Activo",
    });
    setOpen(true);
  };

  const handleOpenEdit = (row) => {
    setEditingId(row.id);
    setForm({
      nombre: row.nombre,
      ci: row.ci,
      especialidad: row.especialidad,
      horario: row.horario,
      estado: row.estado,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    // Validaciones simples
    if (!form.nombre.trim() || !form.ci.trim()) {
      setToast({
        open: true,
        msg: "Nombre y CI son obligatorios",
        sev: "warning",
      });
      return;
    }
    try {
      if (editingId) {
        await updatePersonal(editingId, form);
        setToast({ open: true, msg: "Personal actualizado", sev: "success" });
      } else {
        await createPersonal(form);
        setToast({ open: true, msg: "Personal creado", sev: "success" });
      }
      setOpen(false);
      await load();
    } catch (e) {
      setToast({ open: true, msg: e.message, sev: "error" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePersonal(id);
      setToast({ open: true, msg: "Eliminado correctamente", sev: "success" });
      setConfirmId(null);
      await load();
    } catch (e) {
      setToast({ open: true, msg: e.message, sev: "error" });
    }
  };

  const estadoChipColor = useMemo(
    () => ({
      Activo: "success",
      Inactivo: "default",
    }),
    []
  );

  return (
    <Box sx={{ backgroundColor: "background.default", p: 7, borderRadius: 2 }}>
      <Toolbar
        disableGutters
        sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}
      >
        <Typography variant="h5">Personal</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenNew}
          sx={{ backgroundColor: "primary.main", color: "white" }}
        >
          Nuevo
        </Button>
      </Toolbar>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>CI</TableCell>
            <TableCell>Especialidad</TableCell>
            <TableCell>Horario</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!loading &&
            rows.map((r) => (
              <TableRow key={r.id} hover>
                <TableCell>{r.nombre}</TableCell>
                <TableCell>{r.ci}</TableCell>
                <TableCell>{r.especialidad}</TableCell>
                <TableCell sx={{ textTransform: "capitalize" }}>
                  {r.horario}
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={r.estado}
                    color={estadoChipColor[r.estado]}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleOpenEdit(r)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => setConfirmId(r.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          {!loading && rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} align="center">
                Sin registros
              </TableCell>
            </TableRow>
          )}
          {loading && (
            <TableRow>
              <TableCell colSpan={6} align="center">
                Cargando…
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Dialog Crear/Editar */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingId ? "Editar Personal" : "Nuevo Personal"}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nombre *"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              autoFocus
            />
            <TextField
              label="CI *"
              value={form.ci}
              onChange={(e) => setForm({ ...form, ci: e.target.value })}
            />
            <TextField
              select
              label="Especialidad"
              value={form.especialidad}
              onChange={(e) =>
                setForm({ ...form, especialidad: e.target.value })
              }
            >
              {ESPECIALIDADES.map((op) => (
                <MenuItem key={op} value={op}>
                  {op}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Horario"
              value={form.horario}
              onChange={(e) => setForm({ ...form, horario: e.target.value })}
            >
              {HORARIOS.map((op) => (
                <MenuItem key={op} value={op}>
                  {op}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Estado"
              value={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.value })}
            >
              {ESTADOS.map((op) => (
                <MenuItem key={op} value={op}>
                  {op}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmación de borrado */}
      <Dialog open={!!confirmId} onClose={() => setConfirmId(null)}>
        <DialogTitle>Eliminar registro</DialogTitle>
        <DialogContent dividers>
          ¿Seguro que deseas eliminar este miembro del personal?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmId(null)}>Cancelar</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => handleDelete(confirmId)}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={2000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={toast.sev} variant="filled">
          {toast.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}

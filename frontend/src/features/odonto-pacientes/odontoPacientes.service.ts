import api from '@/shared/api/apiClient';
import type { Cita } from '@/types/cita';
import type { Paciente } from '@/types/paciente';

export type PacienteLite = {
  idUsuario_Paciente: number;
  ci?: string;
  nombre?: string;
  paterno?: string;
  materno?: string | null;
  telefono?: string;
  correo?: string;
};

type Paginado<T> = {
  current_page: number;
  data: T[];
  first_page_url?: string;
  from?: number;
  last_page: number;
  last_page_url?: string;
  next_page_url?: string | null;
  per_page: number;
  prev_page_url?: string | null;
  to?: number;
  total: number;
};

export async function getOdontologoByUsuario(idUsuario: number) {
  const { data } = await api.get('/odontologos', { params: { per_page: 1000 } });
  const list = (data?.data ?? data) as Array<{
    idUsuario_Odontologo: number;
    usuario?: { idUsuario: number };
  }>;

  return list.find((o) => o?.usuario?.idUsuario === idUsuario);
}

export async function fetchCitaDetalle(citaId: number) {
  const { data } = await api.get(`/citas/${citaId}`);
  return data?.data ?? data;
}

export async function fetchMisPacientes(idUsuarioOdonto: number): Promise<PacienteLite[]> {
  const { data } = await api.get(`/odontologos/${idUsuarioOdonto}/agenda`);
  const citas: Cita[] = data?.agenda?.citas ?? [];

  const seen = new Set<number>();
  const result: PacienteLite[] = [];

  for (const c of citas) {
    const det = await fetchCitaDetalle(c.idCita);
    const pacientes = (det?.pacientes ?? []) as Paciente[];

    for (const p of pacientes) {
      const id = p.idUsuario_Paciente;
      if (!id || seen.has(id)) continue;

      const u = p.usuario ?? {};
      result.push({
        idUsuario_Paciente: id,
        ci: u.ci,
        nombre: u.nombre,
        paterno: u.paterno,
        materno: u.materno ?? null,
        telefono: u.telefono,
        correo: u.correo,
      });
      seen.add(id);
    }
  }

  result.sort((a, b) => `${a.paterno ?? ''}${a.nombre ?? ''}`.localeCompare(`${b.paterno ?? ''}${b.nombre ?? ''}`));

  return result;
}


export async function searchPacientes(query: string, page = 1, perPage = 10) {
  const trimmed = query.trim();
  
  const isCI = /^\d+$/.test(trimmed);
  
  try {
    const { data } = await api.get('/pacientes', { 
      params: { 
        search: trimmed, 
        page, 
        per_page: perPage 
      } 
    });
    
    const pag = data as Paginado<{
      idUsuario_Paciente: number;
      usuario?: {
        idUsuario: number;
        ci: string;
        nombre: string;
        paterno?: string;
        materno?: string | null;
        telefono?: string;
        correo?: string;
      };
    }>;

    let rows: PacienteLite[] = (pag.data ?? []).map((row) => ({
      idUsuario_Paciente: row.idUsuario_Paciente,
      ci: row.usuario?.ci,
      nombre: row.usuario?.nombre,
      paterno: row.usuario?.paterno,
      materno: row.usuario?.materno ?? null,
      telefono: row.usuario?.telefono,
      correo: row.usuario?.correo,
    }));

    if (isCI && rows.length === 0) {
      const { data: allData } = await api.get('/pacientes', { 
        params: { per_page: 100 } 
      });
      
      const allPag = allData as Paginado<{
        idUsuario_Paciente: number;
        usuario?: {
          idUsuario: number;
          ci: string;
          nombre: string;
          paterno?: string;
          materno?: string | null;
          telefono?: string;
          correo?: string;
        };
      }>;

      const filtered = (allPag.data ?? []).filter((row) => 
        row.usuario?.ci?.includes(trimmed)
      );

      rows = filtered.map((row) => ({
        idUsuario_Paciente: row.idUsuario_Paciente,
        ci: row.usuario?.ci,
        nombre: row.usuario?.nombre,
        paterno: row.usuario?.paterno,
        materno: row.usuario?.materno ?? null,
        telefono: row.usuario?.telefono,
        correo: row.usuario?.correo,
      }));

      return {
        items: rows,
        page: 1,
        lastPage: 1,
        total: rows.length,
        perPage: rows.length,
      };
    }

    return {
      items: rows,
      page: pag.current_page ?? page,
      lastPage: pag.last_page ?? page,
      total: pag.total ?? rows.length,
      perPage: pag.per_page ?? perPage,
    };
  } catch (error) {
    console.error('Error en searchPacientes:', error);
    return {
      items: [],
      page: 1,
      lastPage: 1,
      total: 0,
      perPage,
    };
  }
}
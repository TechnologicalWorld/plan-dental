import { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '@/shared/hooks/useAuthStore';
import {
  fetchMisPacientes,
  getOdontologoByUsuario,
  searchPacientes,
  type PacienteLite,
} from '../odontoPacientes.service';

export default function useMisPacientes() {
  const { user } = useAuthStore();
  const idUsuario = user?.idUsuario;

  const [loading, setLoading] = useState(false);
  const [misPacientes, setMisPacientes] = useState<PacienteLite[]>([]);
  const [error, setError] = useState<string | null>(null);

  // búsqueda global
  const [query, setQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [results, setResults] = useState<PacienteLite[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 10;

  const canSearch = useMemo(() => query.trim().length >= 2, [query]);

  async function loadMisPacientes() {
    if (!idUsuario) return;
    setLoading(true);
    setError(null);
    try {
      // 1) obtener odontólogo por usuario
      const odonto = await getOdontologoByUsuario(idUsuario);
      if (!odonto?.idUsuario_Odontologo) {
        setMisPacientes([]);
        return;
      }
      // 2) fetch y set
      const list = await fetchMisPacientes(odonto.idUsuario_Odontologo);
      setMisPacientes(list);
    } catch (e: any) {
      setError(e?.message ?? 'Error al cargar pacientes');
    } finally {
      setLoading(false);
    }
  }

  async function doSearch(p = 1) {
    if (!canSearch) {
      setResults([]);
      setPage(1);
      setLastPage(1);
      setTotal(0);
      return;
    }
    setSearchLoading(true);
    try {
      const { items, page: pp, lastPage: lp, total: tot } = await searchPacientes(query.trim(), p, perPage);
      setResults(items);
      setPage(pp);
      setLastPage(lp);
      setTotal(tot);
    } finally {
      setSearchLoading(false);
    }
  }

  useEffect(() => {
    void loadMisPacientes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idUsuario]);

  useEffect(() => {
    // limpiar resultados cuando se borra la query
    if (!canSearch) {
      setResults([]);
      setPage(1);
      setLastPage(1);
      setTotal(0);
    }
  }, [canSearch]);

  return {
    // Mis Pacientes
    loading,
    error,
    misPacientes,
    reloadMisPacientes: loadMisPacientes,

    // Buscar
    query,
    setQuery,
    canSearch,
    searchLoading,
    results,
    page,
    lastPage,
    total,
    perPage,
    doSearch,
    setPage,
  };
}

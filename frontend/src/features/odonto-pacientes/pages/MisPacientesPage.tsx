import React, { useEffect, useState } from 'react';
import useMisPacientes from '../hooks/useMisPacientes';
import MisPacientesTable from '../components/MisPacientesTable';
import BuscarPacienteResults from '../components/BuscarPacienteResults';

export default function MisPacientesPage() {
  const {
    loading,
    error,
    misPacientes,
    reloadMisPacientes,

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
  } = useMisPacientes();

  const [tab, setTab] = useState<'mine'|'search'>('mine');

  useEffect(() => {
    if (tab === 'search' && canSearch) {
      void doSearch(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, canSearch]);

  const onPrev = () => {
    if (page > 1) {
      const p = page - 1;
      setPage(p);
      void doSearch(p);
    }
  };
  const onNext = () => {
    if (page < lastPage) {
      const p = page + 1;
      setPage(p);
      void doSearch(p);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Pacientes</h1>
        {tab === 'mine' && (
          <button
            onClick={() => reloadMisPacientes()}
            className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
          >
            Recargar
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          className={`px-3 py-1.5 rounded ${tab === 'mine' ? 'bg-white/15' : 'bg-white/5 hover:bg-white/10'}`}
          onClick={() => setTab('mine')}
        >
          Mis Pacientes
        </button>
        <button
          className={`px-3 py-1.5 rounded ${tab === 'search' ? 'bg-white/15' : 'bg-white/5 hover:bg-white/10'}`}
          onClick={() => setTab('search')}
        >
          Buscar Paciente
        </button>
      </div>

      {/* Contenido */}
      <div className="rounded bg-slate-900 p-4">
        {tab === 'mine' ? (
          <>
            {loading && <div className="text-sm opacity-80">Cargando pacientes…</div>}
            {error && <div className="text-sm text-rose-400">{error}</div>}
            {!loading && !error && <MisPacientesTable rows={misPacientes} />}
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                className="px-3 py-2 rounded bg-white/10 outline-none w-full"
                placeholder="Buscar por nombre o CI…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                onClick={() => canSearch ? void doSearch(1) : undefined}
                className="px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!canSearch}
                title={!canSearch ? 'Escribe al menos 2 caracteres' : 'Buscar'}
              >
                Buscar
              </button>
            </div>

            <BuscarPacienteResults
              rows={results}
              page={page}
              lastPage={lastPage}
              total={total}
              onPrev={onPrev}
              onNext={onNext}
              loading={searchLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
}

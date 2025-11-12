import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/shared/hooks/useAuthStore";
import { obtenerMisEventos, type AgendaEvent } from "../agenda.service";

export function useMiAgenda() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<AgendaEvent[]>([]);

  const reload = useCallback(async () => {
    if (!user?.idUsuario) {
      setError("Usuario no autenticado");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const eventos = await obtenerMisEventos(user.idUsuario);
      setEvents(eventos);
    } catch (err: any) {
      console.error("Error en useMiAgenda:", err);
      setError(err?.message ?? "Error al cargar la agenda");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [user?.idUsuario]);

  useEffect(() => {
    reload();
  }, [reload]);

  return {
    loading,
    error,
    events,
    reload,
  };
}
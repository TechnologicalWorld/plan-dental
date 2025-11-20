import React, { useEffect, useState } from "react";
import CalendarToolbar from "@/features/calendario/components/CalendarToolbar";
import CalendarMonth from "@/features/calendario/components/CalendarMonth";
import CalendarWeek from "@/features/calendario/components/CalendarWeek";
import EventInfoModal from "@/features/calendario/components/EventInfoModal";
import { fetchCitasComoEventos, type CalendarioEvent } from "@/features/calendario/calendario.service";
import { addDays, getWeekStart } from "@/shared/utils/dateHelper";

type ViewMode = "month" | "week";

export default function CalendarioGeneralAdminPage() {
  const [view, setView] = useState<ViewMode>("week");
  const [current, setCurrent] = useState<Date>(getWeekStart(new Date()));
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<CalendarioEvent[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchCitasComoEventos();
      setEvents(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function goPrev() {
    setCurrent((d) => view === "month"
      ? new Date(d.getFullYear(), d.getMonth() - 1, 1)
      : addDays(d, -7)
    );
  }
  function goNext() {
    setCurrent((d) => view === "month"
      ? new Date(d.getFullYear(), d.getMonth() + 1, 1)
      : addDays(d, 7)
    );
  }
  function goToday() {
    setCurrent(getWeekStart(new Date()));
  }

  return (
    <div className="space-y-4">
      <CalendarToolbar
        current={current}
        onPrev={goPrev}
        onNext={goNext}
        onToday={goToday}
        view={view}
        onViewChange={setView}
        onReload={load}
      />

      {loading && <div className="text-sm opacity-70">Cargando citas…</div>}

      {view === "month" ? (
        <CalendarMonth
          current={current}
          events={events}
          onSelectEvent={(id) => setSelected(id)}
        />
      ) : (
        <CalendarWeek
          current={current}
          events={events}
          onSelectEvent={(id) => setSelected(id)}
          startHour={8}
          endHour={20}
          slotMinutes={60}
        />
      )}

      <EventInfoModal
        open={selected != null}
        onClose={() => setSelected(null)}
        citaId={selected ?? undefined}
      />
    </div>
  );
}

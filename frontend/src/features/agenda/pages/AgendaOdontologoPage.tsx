import React, { useState } from "react";
import CalendarToolbar from "@/features/calendario/components/CalendarToolbar";
import CalendarMonth from "@/features/calendario/components/CalendarMonth";
import CalendarWeek from "@/features/calendario/components/CalendarWeek";
import EventInfoModal from "@/features/calendario/components/EventInfoModal";
import { useMiAgenda } from "../hooks/useMiAgenda";
import { addDays, getWeekStart } from "@/shared/utils/dateHelper";

type ViewMode = "month" | "week";

export default function AgendaOdontologoPage() {
  const [view, setView] = useState<ViewMode>("week");
  const [current, setCurrent] = useState<Date>(getWeekStart(new Date()));
  const [selectedCitaId, setSelectedCitaId] = useState<number | null>(null);

  const { loading, error, events, reload } = useMiAgenda();

  function handlePrev() {
    setCurrent((prev) =>
      view === "month"
        ? new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
        : addDays(prev, -7)
    );
  }

  function handleNext() {
    setCurrent((prev) =>
      view === "month"
        ? new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
        : addDays(prev, 7)
    );
  }

  function handleToday() {
    setCurrent(view === "week" ? getWeekStart(new Date()) : new Date());
  }

  function handleSelectEvent(id: number) {
    setSelectedCitaId(id);
  }

  function handleCloseModal() {
    setSelectedCitaId(null);
  }

  return (
    <div className="space-y-4">
      <CalendarToolbar
        current={current}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        view={view}
        onViewChange={setView}
        onReload={reload}
      />

      {loading && (
        <div className="p-4 bg-slate-800/50 rounded text-center">
          <p className="text-slate-300">Cargando tu agenda...</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-900/20 border border-rose-500/30 rounded">
          <p className="text-rose-400">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {view === "month" ? (
            <CalendarMonth
              current={current}
              events={events}
              onSelectEvent={handleSelectEvent}
            />
          ) : (
            <CalendarWeek
              current={current}
              events={events}
              onSelectEvent={handleSelectEvent}
              startHour={8}
              endHour={20}
              slotMinutes={60}
            />
          )}
        </>
      )}

      <EventInfoModal
        open={selectedCitaId !== null}
        onClose={handleCloseModal}
        citaId={selectedCitaId}
      />
    </div>
  );
}
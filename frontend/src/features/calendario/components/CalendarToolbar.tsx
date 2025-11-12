import React, { useState, useRef, useEffect } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

type ViewMode = "month" | "week";

type Props = {
  current: Date;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  view: ViewMode;
  onViewChange: (v: ViewMode) => void;
  onReload?: () => void;
};

function formatHeader(date: Date, view: ViewMode) {
  const months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  if (view === "month") {
    return `${months[date.getMonth()]} De ${date.getFullYear()}`;
  }
  const monday = new Date(date);
  const day = (monday.getDay() + 6) % 7;
  monday.setDate(monday.getDate() - day);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const dd = (d: Date) => `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
  return `Semana Del ${dd(monday)}`;
}

export default function CalendarToolbar({ current, onPrev, onNext, onToday, view, onViewChange, onReload }: Props) {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const currentYear = current.getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    }
    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showPicker]);

  function selectMonthYear(month: number, year: number) {
    const newDate = new Date(year, month, 1);
    if (view === "week") {
      const day = (newDate.getDay() + 6) % 7;
      newDate.setDate(newDate.getDate() - day);
    }
    setShowPicker(false);
    
    const currentMonth = current.getMonth();
    const currentYr = current.getFullYear();
    const targetMonth = month;
    const targetYear = year;
    
    const diff = (targetYear - currentYr) * 12 + (targetMonth - currentMonth);
    
    if (diff > 0) {
      for (let i = 0; i < diff; i++) onNext();
    } else if (diff < 0) {
      for (let i = 0; i < Math.abs(diff); i++) onPrev();
    }
  }

  return (
    <header className="flex items-center justify-between p-3 bg-slate-900 text-slate-100 rounded">
      <div className="flex items-center gap-2">
        <div className="relative" ref={pickerRef}>
          <button 
            className="size-8 grid place-items-center rounded bg-white/10 hover:bg-white/20 transition"
            onClick={() => setShowPicker(!showPicker)}
            title="Seleccionar mes/año"
          >
            <CalendarDays size={16} />
          </button>

          {showPicker && (
            <div className="absolute top-full left-0 mt-2 bg-slate-800 border border-white/20 rounded-lg shadow-xl z-50 p-4 min-w-[320px]">
              <div className="mb-3">
                <label className="text-xs opacity-70 mb-1 block">Año</label>
                <div className="flex gap-2">
                  {years.map(y => (
                    <button
                      key={y}
                      className={`flex-1 px-3 py-1.5 rounded text-sm ${
                        y === currentYear ? "bg-blue-600" : "bg-white/10 hover:bg-white/20"
                      }`}
                      onClick={() => {
                        const m = current.getMonth();
                        selectMonthYear(m, y);
                      }}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs opacity-70 mb-1 block">Mes</label>
                <div className="grid grid-cols-3 gap-2">
                  {months.map((m, idx) => (
                    <button
                      key={idx}
                      className={`px-3 py-1.5 rounded text-sm ${
                        idx === current.getMonth() && currentYear === current.getFullYear()
                          ? "bg-blue-600"
                          : "bg-white/10 hover:bg-white/20"
                      }`}
                      onClick={() => selectMonthYear(idx, currentYear)}
                    >
                      {m.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <button className="p-2 rounded hover:bg-white/10" onClick={onPrev} title="Anterior">
          <ChevronLeft size={16} />
        </button>
        <button className="p-2 rounded hover:bg-white/10" onClick={onToday} title="Hoy">
          Hoy
        </button>
        <button className="p-2 rounded hover:bg-white/10" onClick={onNext} title="Siguiente">
          <ChevronRight size={16} />
        </button>

        <div className="ml-3 text-lg font-semibold">{formatHeader(current, view)}</div>
      </div>

      <div className="flex items-center gap-2">
        <div className="inline-flex rounded overflow-hidden border border-white/10">
          <button
            className={`px-3 py-1.5 text-sm ${view === "month" ? "bg-white/10" : "hover:bg-white/5"}`}
            onClick={() => onViewChange("month")}
          >
            Mensual
          </button>
        </div>
        <div className="inline-flex rounded overflow-hidden border border-white/10">
          <button
            className={`px-3 py-1.5 text-sm ${view === "week" ? "bg-white/10" : "hover:bg-white/5"}`}
            onClick={() => onViewChange("week")}
          >
            Semanal
          </button>
        </div>

        {onReload && (
          <button onClick={onReload} className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1">
            <RotateCcw size={14} /> Recargar
          </button>
        )}
      </div>
    </header>
  );
}
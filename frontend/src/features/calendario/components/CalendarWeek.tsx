import React, { useMemo } from "react";
import { addDays, fmtDayKey, fmtHourLabel, getWeekStart } from "@/shared/utils/dateHelper";
import EventBadge from "./EventBadge";
import type { CalendarioEvent } from "@/features/calendario/calendario.service";

type Props = {
  current: Date;              
  events: CalendarioEvent[];  
  onSelectEvent: (id: number) => void;
  startHour?: number;         
  endHour?: number;           
  slotMinutes?: number;       
};

const weekDayNames = ["lun","mar","mié","jue","vie","sáb","dom"];

export default function CalendarWeek({
  current,
  events,
  onSelectEvent,
  startHour = 8,
  endHour = 20,
  slotMinutes = 60, 
}: Props) {
  const weekStart = getWeekStart(current);
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const hours = Array.from({ length: (endHour - startHour) }, (_, i) => startHour + i);

  const byDay = useMemo(() => {
    const m = new Map<string, CalendarioEvent[]>();
    for (const ev of events) {
      const key = fmtDayKey(ev.start);
      const arr = m.get(key) ?? [];
      arr.push(ev);
      m.set(key, arr);
    }
    return m;
  }, [events]);

  return (
    <div className="bg-slate-900 text-slate-100 rounded overflow-hidden">
      {/* Cabecera de días */}
      <div className="grid grid-cols-8 border-b border-white/10">
        <div className="px-2 py-2 text-sm opacity-60"> </div>
        {days.map((d, i) => (
          <div key={i} className="px-2 py-2 text-sm">
            <div className="font-medium">{weekDayNames[i]}</div>
            <div className="opacity-70">{String(d.getDate()).padStart(2,"0")}/{String(d.getMonth()+1).padStart(2,"0")}</div>
          </div>
        ))}
      </div>

      {/* Grid por horas */}
      <div className="grid grid-cols-8">
        {/* Columna de horas */}
        <div className="border-r border-white/10">
          {hours.map((h) => (
            <div key={h} className="h-16 border-b border-white/10 px-2 text-xs opacity-70 flex items-start pt-1">
              {fmtHourLabel(h)}
            </div>
          ))}
        </div>

        {/* 7 columnas de días */}
        {days.map((d, idx) => {
          const key = fmtDayKey(d);
          const list = (byDay.get(key) ?? []).sort((a,b) => a.start.getTime() - b.start.getTime());

          return (
            <div key={idx} className="border-r border-white/10 relative">
              {/* filas por hora */}
              {hours.map((h) => (
                <div key={h} className="h-16 border-b border-white/10"></div>
              ))}

              {/* eventos (layout simple por hora) */}
              <div className="absolute inset-0 p-1">
                {list.map((ev) => {
                  const startH = ev.start.getHours() + ev.start.getMinutes()/60;
                  const endH = ev.end.getHours() + ev.end.getMinutes()/60;
                  const topPct = ((startH - startHour) / (endHour - startHour)) * 100;
                  const heightPct = (Math.max(endH - startH, slotMinutes/60) / (endHour - startHour)) * 100;

                  return (
                    <div
                      key={ev.id}
                      className="absolute left-1 right-1"
                      style={{ top: `${topPct}%`, height: `${heightPct}%` }}
                    >
                      <EventBadge
                        title={ev.title}
                        estado={ev.estado}
                        onClick={() => onSelectEvent(ev.id)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

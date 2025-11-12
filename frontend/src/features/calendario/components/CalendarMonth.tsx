import React from "react";
import { buildMonthGrid, fmtDayKey } from "@/shared/utils/dateHelper";
import EventBadge from "./EventBadge";

import type { CalendarioEvent } from "@/features/calendario/calendario.service";

type Props = {
  current: Date;
  events: CalendarioEvent[];
  onSelectEvent: (id: number) => void;
};

const weekDayNames = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];

export default function CalendarMonth({ current, events, onSelectEvent }: Props) {
  const grid = buildMonthGrid(current);
  const month = current.getMonth();

  const byDay = new Map<string, CalendarioEvent[]>();
  for (const ev of events) {
    const key = fmtDayKey(ev.start);
    const arr = byDay.get(key) ?? [];
    arr.push(ev);
    byDay.set(key, arr);
  }

  return (
    <div className="bg-slate-900 text-slate-100 rounded">
      {/* header semana */}
      <div className="grid grid-cols-7 border-b border-white/10">
        {weekDayNames.map((w) => (
          <div key={w} className="px-3 py-2 text-sm opacity-80">{w}</div>
        ))}
      </div>

      {/* celdas */}
      <div className="grid grid-cols-7 grid-rows-6">
        {grid.map((d, i) => {
          const key = fmtDayKey(d);
          const list = byDay.get(key) ?? [];
          const otherMonth = d.getMonth() !== month;

          return (
            <div
              key={i}
              className={`min-h-[110px] border-b border-r border-white/10 p-2 ${otherMonth ? "opacity-60" : ""}`}
            >
              <div className="text-xs opacity-70 mb-1">{d.getDate()}</div>
              <div className="space-y-1">
                {list.slice(0, 4).map((ev) => (
                  <EventBadge
                    key={ev.id}
                    title={ev.title}
                    estado={ev.estado}
                    compact
                    onClick={() => onSelectEvent(ev.id)}
                  />
                ))}
                {list.length > 4 && (
                  <div className="text-xs opacity-70">+{list.length - 4} más</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function extractHHmm(input: string): string {
  const s = String(input);
  if (/^\d{2}:\d{2}(:\d{2})?$/.test(s)) return s.slice(0, 5);
  const m = s.match(/T(\d{2}):(\d{2})/);
  return m ? `${m[1]}:${m[2]}` : "00:00";
}

export function combineDateAndTime(fechaIso: string, hhmm: string): Date {
  const fechaStr = String(fechaIso).slice(0, 10); 
  const [year, month, day] = fechaStr.split("-").map(Number);
  const [h, m] = hhmm.split(":").map(Number);
  
  return new Date(year, month - 1, day, h || 0, m || 0, 0, 0);
}

export function addMinutes(date: Date, minutes: number): Date {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() + minutes);
  return d;
}

export function getMonthGridStart(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), 1);
  const day = (d.getDay() + 6) % 7; // 0 = lunes
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function buildMonthGrid(date: Date): Date[] {
  const start = getMonthGridStart(date);
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
}

/** Suma días */
export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/** Obtiene el lunes de la semana del date */
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // 0 = lunes
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Formateos simples */
export const fmtDayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

export const pad2 = (n: number) => String(n).padStart(2, "0");
export const fmtHourLabel = (h: number) => `${pad2(h)}:00`;
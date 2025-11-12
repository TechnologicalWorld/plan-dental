import React from "react";

type Props = {
  title: string;
  estado?: string; 
  onClick?: () => void;
  compact?: boolean;
};

function colorByEstado(estado?: string) {
  const e = String(estado || "").toLowerCase();
  if (e.includes("pend")) return "bg-amber-500/90";
  if (e.includes("conf")) return "bg-blue-600/90";
  if (e.includes("compl")) return "bg-emerald-600/90";
  if (e.includes("canc")) return "bg-rose-600/90";
  return "bg-slate-600/90";
}

export default function EventBadge({ title, estado, onClick, compact }: Props) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded px-2 ${compact ? "py-0.5 text-xs" : "py-1 text-sm"} text-white ${colorByEstado(estado)}`}
      title={title}
    >
      {title}
    </button>
  );
}

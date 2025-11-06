// src/shared/ui/Loader.tsx
export default function Loader() {
  return (
    <div className="min-h-[40vh] grid place-items-center text-teal-100">
      <div className="animate-pulse">Cargando…</div>
    </div>
  );
}

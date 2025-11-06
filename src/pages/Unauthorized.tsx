// src/pages/Unauthorized.tsx
export default function Unauthorized() {
  return (
    <div className="min-h-[calc(100vh-56px)] grid place-items-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-1">403 – No autorizado</h1>
        <p className="text-sm opacity-80">No tienes permisos para ver esta sección.</p>
      </div>
    </div>
  );
}

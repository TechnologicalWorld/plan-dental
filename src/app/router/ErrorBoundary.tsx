// src/app/router/ErrorBoundary.tsx
export default function ErrorBoundary() {
  return (
    <div className="min-h-[calc(100vh-56px)] grid place-items-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-1">Ups, algo salió mal</h1>
        <p className="text-sm opacity-80">Intenta recargar o volver al dashboard.</p>
      </div>
    </div>
  );
}

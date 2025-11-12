// src/shared/ui/NotFound.tsx
export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-2">404 - No encontrado</h1>
        <p className="text-slate-400 mb-4">
          Esta pantalla aún no está implementada. Pronto estará lista. 
        </p>
        <a className="underline" href="/app/dashboard">Volver al dashboard</a>
      </div>
    </div>
  );
}

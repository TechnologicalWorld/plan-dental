// src/pages/Placeholder.tsx
export default function Placeholder({ title = 'Página' }: { title?: string }) {
  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-semibold mb-2">{title}</h1>
      <p className="opacity-80">
        Vista en construcción. Aquí irá el contenido real de <strong>{title}</strong>.
      </p>
    </div>
  );
}

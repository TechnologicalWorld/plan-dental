// src/app/layout/Topbar.tsx
import { Menu } from 'lucide-react';

type TopbarProps = {
  onToggleSidebar: () => void;
  title?: string;
};

export default function Topbar({ onToggleSidebar, title = 'Plan Dental' }: TopbarProps) {
  return (
    <header className="h-14 px-4 bg-slate-800 text-slate-100 flex items-center gap-3 sticky top-0 z-40">
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded hover:bg-white/10 focus:outline-none"
        aria-label="Alternar menú"
        title="Alternar menú"
      >
        <Menu size={20} />
      </button>

      <img src="/logo.png" alt="Plan Dental" className="h-7 w-7 rounded-full object-contain" />
      <span className="font-semibold tracking-wide">{title}</span>

      <div className="ml-auto text-xs opacity-80">
        Consultorio Odontológico
      </div>
    </header>
  );
}

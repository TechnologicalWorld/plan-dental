// src/shared/ui/Modal.tsx
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  widthClass?: string; // ej. "max-w-2xl"
};

export default function Modal({ open, onClose, title, children, widthClass = 'max-w-2xl' }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Dialog */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className={`w-full ${widthClass} rounded-xl bg-white text-slate-900 shadow-xl`}>
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-slate-100"
              aria-label="Cerrar"
              title="Cerrar"
            >
              <X size={18} />
            </button>
          </div>
          <div className="p-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

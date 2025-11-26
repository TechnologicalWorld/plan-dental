// src/shared/ui/Modal.tsx
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  widthClass?: string; // ej. "max-w-2xl"
};

export default function Modal({
  open,
  onClose,
  title,
  children,
  widthClass = "max-w-2xl",
}: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className={`
            w-full ${widthClass}
            max-h-[90vh]
            rounded-2xl
            bg-slate-950 text-slate-100          
            shadow-2xl border border-slate-800
            flex flex-col
          `}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
            {title && (
              <h2 className="text-base sm:text-lg font-semibold text-slate-100">
                {title}
              </h2>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              aria-label="Cerrar"
              title="Cerrar"
            >
              <X size={18} />
            </button>
          </div>

          {/* Contenido */}
          <div className="p-4 sm:p-5 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

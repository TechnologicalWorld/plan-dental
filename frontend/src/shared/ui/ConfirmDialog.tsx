// src/shared/ui/ConfirmDialog.tsx
import Modal from './Modal';

type Props = {
  open: boolean;
  title?: string;
  message?: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
};

export default function ConfirmDialog({
  open,
  title = 'Confirmar',
  message = '¿Seguro?',
  confirmText = 'Sí, continuar',
  cancelText = 'Cancelar',
  onClose,
  onConfirm,
  loading = false,
}: Props) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="space-y-4">
        <div className="text-sm">{message}</div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 rounded bg-slate-200 hover:bg-slate-300 text-slate-900"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="px-3 py-2 rounded bg-red-600 hover:bg-red-700 text-white disabled:opacity-60"
          >
            {loading ? 'Eliminando…' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

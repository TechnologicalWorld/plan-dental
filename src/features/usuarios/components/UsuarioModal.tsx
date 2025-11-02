// src/features/usuarios/components/UsuarioModal.tsx
import React from 'react';
import type{ Usuario, CreateUsuarioRequest } from '../../../types/usuario';
import { UsuarioForm } from './UsuarioForm';

interface UsuarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  usuario?: Usuario;
  onSubmit: (data: CreateUsuarioRequest) => Promise<boolean>;
  loading?: boolean;
  errors?: Record<string, string[]>;
}

export const UsuarioModal: React.FC<UsuarioModalProps> = ({
  isOpen,
  onClose,
  usuario,
  onSubmit,
  loading = false,
  errors,
}) => {
  if (!isOpen) return null;

  const handleSubmit = async (data: CreateUsuarioRequest) => {
    const success = await onSubmit(data);
    if (success) {
      onClose();
    }
    return success;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {usuario ? 'Editar Usuario' : 'Crear Usuario'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
          </div>
          
          <UsuarioForm
            usuario={usuario}
            onSubmit={handleSubmit}
            onCancel={onClose}
            loading={loading}
            errors={errors}
          />
        </div>
      </div>
    </div>
  );
};
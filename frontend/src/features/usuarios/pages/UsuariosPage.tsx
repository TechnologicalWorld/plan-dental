// src/features/usuarios/pages/UsuariosPage.tsx
import React, { useState } from 'react';
import type{ Usuario, CreateUsuarioRequest, UpdateUsuarioRequest } from '../../../types/usuario';
import { useUsuarios } from '../hooks/useUsuarios';
import { UsuarioTable } from '../components/UsuarioTable';
import { UsuarioModal } from '../components/UsuarioModal';

export const UsuariosPage: React.FC = () => {
  const {
    usuarios,
    loading,
    error,
    createUsuario,
    updateUsuario,
    deleteUsuario,
  } = useUsuarios();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | undefined>();
  const [formLoading, setFormLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string[]> | null>(null);

  const handleCreate = () => {
    setEditingUsuario(undefined);
    setFormErrors(null);
    setIsModalOpen(true);
  };

  const handleEdit = (usuario: Usuario) => {
    setEditingUsuario(usuario);
    setFormErrors(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteUsuario(id);
  };

  const handleSubmit = async (data: CreateUsuarioRequest): Promise<boolean> => {
    setFormLoading(true);
    setFormErrors(null);
    let success = false;

    try {
      if (editingUsuario) {
        // Para actualizar, no requerimos todos los campos
        const updateData: UpdateUsuarioRequest = { ...data };
        // Si no se proporciona contraseña, la eliminamos del objeto
        if (!updateData.contrasena) {
          delete updateData.contrasena;
        }
        success = await updateUsuario(editingUsuario.idUsuario, updateData);
      } else {
        success = await createUsuario(data);
      }
    } catch (err: any) {
      // Manejar errores de validación del servidor
      if (err.response?.data?.errors) {
        setFormErrors(err.response.data.errors);
      }
    } finally {
      setFormLoading(false);
    }

    return success;
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUsuario(undefined);
    setFormErrors(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Crear Usuario
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <UsuarioTable
        usuarios={usuarios}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <UsuarioModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        usuario={editingUsuario}
        onSubmit={handleSubmit}
        loading={formLoading}
        errors={formErrors || undefined}
      />
    </div>
  );
};
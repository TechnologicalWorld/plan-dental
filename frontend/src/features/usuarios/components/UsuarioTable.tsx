import React from "react";
import type { Usuario } from "../../../types/usuario";
import { backendDateToInputDate, formatDateForDisplay, inputDateToBackendDate } from "../../../utils/dateHelper";

interface UsuarioTableProps {
  usuarios: Usuario[];
  onEdit: (usuario: Usuario) => void;
  onDelete: (id: number) => void;
  loading?: boolean;
}

export const UsuarioTable: React.FC<UsuarioTableProps> = ({
  usuarios,
  onEdit,
  onDelete,
  loading = false,
}) => {
  const getGeneroText = (genero: string) => {
    const generos = { M: "Masculino", F: "Femenino", Otro: "Otro" };
    return generos[genero as keyof typeof generos] || genero;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              CI
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre Completo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Correo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Teléfono
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Género
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha Nacimiento
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {usuarios.map((usuario) => (
            <tr key={usuario.idUsuario} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {usuario.ci}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {usuario.nombre} {usuario.paterno} {usuario.materno || ""}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {usuario.correo}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {usuario.telefono}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {getGeneroText(usuario.genero)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    usuario.estado
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {usuario.estado ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatDateForDisplay(usuario.fechaNacimiento)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  onClick={() => onEdit(usuario)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  Editar
                </button>
                <button
                  onClick={() => {
                    if (
                      window.confirm("¿Estás seguro de eliminar este usuario?")
                    ) {
                      onDelete(usuario.idUsuario);
                    }
                  }}
                  className="text-red-600 hover:text-red-900"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {usuarios.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No hay usuarios registrados
        </div>
      )}
    </div>
  );
};

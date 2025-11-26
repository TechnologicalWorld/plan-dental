import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type{ Usuario, CreateUsuarioRequest } from '../../../types/usuario';
import { backendDateToInputDate } from '../../../utils/dateHelper';

interface UsuarioFormProps {
  usuario?: Usuario;
  onSubmit: (data: CreateUsuarioRequest) => Promise<boolean>;
  onCancel: () => void;
  loading?: boolean;
  errors?: Record<string, string[]>;
}

type FormData = Omit<CreateUsuarioRequest, 'estado'> & {
  estado: boolean;
};

export const UsuarioForm: React.FC<UsuarioFormProps> = ({
  usuario,
  onSubmit,
  onCancel,
  loading = false,
  errors: serverErrors,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<FormData>();

  useEffect(() => {
    if (usuario) {
      const fechaFormateada = backendDateToInputDate(usuario.fechaNacimiento);
      
      reset({
        ci: usuario.ci,
        nombre: usuario.nombre,
        paterno: usuario.paterno,
        materno: usuario.materno || '',
        fechaNacimiento: fechaFormateada,
        genero: usuario.genero,
        telefono: usuario.telefono,
        correo: usuario.correo,
        direccion: usuario.direccion,
        estado: usuario.estado ?? true,
        contrasena: '', 
      });
    } else {
      reset({
        estado: true,
        genero: 'M', 
      });
    }
  }, [usuario, reset]);

  useEffect(() => {
    if (serverErrors) {
      Object.keys(serverErrors).forEach((field) => {
        setError(field as keyof FormData, {
          type: 'server',
          message: serverErrors[field]?.[0],
        });
      });
    }
  }, [serverErrors, setError]);

  const handleFormSubmit = async (data: FormData) => {
    const success = await onSubmit(data);
    return success;
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CI */}
        <div>
          <label className="block text-sm font-medium text-gray-700">CI *</label>
          <input
            type="text"
            {...register('ci', { 
              required: 'CI es requerido',
              minLength: {
                value: 1,
                message: 'CI debe tener al menos 1 carácter'
              }
            })}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.ci && <p className="text-red-500 text-sm">{errors.ci.message}</p>}
        </div>

        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre *</label>
          <input
            type="text"
            {...register('nombre', { 
              required: 'Nombre es requerido',
              minLength: {
                value: 2,
                message: 'Nombre debe tener al menos 2 caracteres'
              }
            })}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre.message}</p>}
        </div>

        {/* Paterno */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Apellido Paterno *</label>
          <input
            type="text"
            {...register('paterno', { 
              required: 'Apellido paterno es requerido',
              minLength: {
                value: 2,
                message: 'Apellido paterno debe tener al menos 2 caracteres'
              }
            })}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.paterno && <p className="text-red-500 text-sm">{errors.paterno.message}</p>}
        </div>

        {/* Materno */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Apellido Materno</label>
          <input
            type="text"
            {...register('materno')}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Fecha Nacimiento - CORREGIDO */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha Nacimiento *</label>
          <input
            type="date"
            {...register('fechaNacimiento', { 
              required: 'Fecha de nacimiento es requerida',
              validate: {
                validDate: (value) => {
                  if (!value) return true;
                  const date = new Date(value);
                  return !isNaN(date.getTime()) || 'Fecha inválida';
                },
                pastDate: (value) => {
                  if (!value) return true;
                  const date = new Date(value);
                  return date < new Date() || 'La fecha debe ser en el pasado';
                }
              }
            })}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.fechaNacimiento && (
            <p className="text-red-500 text-sm">{errors.fechaNacimiento.message}</p>
          )}
        </div>

        {/* Género */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Género *</label>
          <select
            {...register('genero', { required: 'Género es requerido' })}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="Otro">Otro</option>
          </select>
          {errors.genero && <p className="text-red-500 text-sm">{errors.genero.message}</p>}
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Teléfono *</label>
          <input
            type="text"
            {...register('telefono', { 
              required: 'Teléfono es requerido',
              minLength: {
                value: 7,
                message: 'Teléfono debe tener al menos 7 dígitos'
              }
            })}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.telefono && <p className="text-red-500 text-sm">{errors.telefono.message}</p>}
        </div>

        {/* Correo */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Correo *</label>
          <input
            type="email"
            {...register('correo', { 
              required: 'Correo es requerido',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Correo inválido'
              }
            })}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.correo && <p className="text-red-500 text-sm">{errors.correo.message}</p>}
        </div>

        {/* Contraseña */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {usuario ? 'Nueva Contraseña (opcional)' : 'Contraseña *'}
          </label>
          <input
            type="password"
            {...register('contrasena', { 
              required: usuario ? false : 'Contraseña es requerida',
              minLength: {
                value: 6,
                message: 'Mínimo 6 caracteres'
              }
            })}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.contrasena && <p className="text-red-500 text-sm">{errors.contrasena.message}</p>}
          {usuario && (
            <p className="text-xs text-gray-500 mt-1">Dejar en blanco para mantener la contraseña actual</p>
          )}
        </div>

        {/* Dirección */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Dirección *</label>
          <textarea
            {...register('direccion', { 
              required: 'Dirección es requerida',
              minLength: {
                value: 5,
                message: 'Dirección debe tener al menos 5 caracteres'
              }
            })}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.direccion && <p className="text-red-500 text-sm">{errors.direccion.message}</p>}
        </div>

        {/* Estado */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('estado')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Activo</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Guardando...' : usuario ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
};
import { useState, useEffect } from 'react';
import type{ Usuario, CreateUsuarioRequest, UpdateUsuarioRequest} from '../../../types/usuario';
import { usuarioService } from '../../../entities/usuarios/services';
import { inputDateToBackendDate } from '../../../utils/dateHelper';

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUsuarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await usuarioService.getAll();
      setUsuarios(data);
    } catch (err) {
      setError('Error al cargar los usuarios');
      console.error('Error loading usuarios:', err);
    } finally {
      setLoading(false);
    }
  };

  const createUsuario = async (usuarioData: CreateUsuarioRequest): Promise<boolean> => {
    try {
      const dataParaBackend = {
        ...usuarioData,
        fechaNacimiento: inputDateToBackendDate(usuarioData.fechaNacimiento)
      };
      
      const newUsuario = await usuarioService.create(dataParaBackend);
      setUsuarios(prev => [...prev, newUsuario]);
      setError(null);
      return true;
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const errorMsg = Object.values(err.response.data.errors).flat().join(', ');
        setError(errorMsg);
      } else {
        setError(err.response?.data?.message || 'Error al crear usuario');
      }
      return false;
    }
  };

  const updateUsuario = async (id: number, usuarioData: UpdateUsuarioRequest): Promise<boolean> => {
    try {
      const dataParaBackend = usuarioData.fechaNacimiento 
        ? {
            ...usuarioData,
            fechaNacimiento: inputDateToBackendDate(usuarioData.fechaNacimiento)
          }
        : usuarioData;
      
      const updatedUsuario = await usuarioService.update(id, dataParaBackend);
      setUsuarios(prev => prev.map(user => 
        user.idUsuario === id ? updatedUsuario : user
      ));
      setError(null);
      return true;
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const errorMsg = Object.values(err.response.data.errors).flat().join(', ');
        setError(errorMsg);
      } else {
        setError(err.response?.data?.message || 'Error al actualizar usuario');
      }
      return false;
    }
  };

  const deleteUsuario = async (id: number): Promise<boolean> => {
    try {
      await usuarioService.delete(id);
      setUsuarios(prev => prev.filter(user => user.idUsuario !== id));
      setError(null);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al eliminar usuario');
      return false;
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, []);

  return {
    usuarios,
    loading,
    error,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    refetch: loadUsuarios,
  };
};
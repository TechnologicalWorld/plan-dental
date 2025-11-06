import apiClient from "../../shared/api/apiClient";
import type {
  Usuario,
  CreateUsuarioRequest,
  UpdateUsuarioRequest,
  ApiResponse,
} from "../../types/usuario";

export const usuarioService = {
  getAll: async (): Promise<Usuario[]> => {
    const response = await apiClient.get<ApiResponse<Usuario[]>>("/usuarios");
    return response.data.data;
  },

  getById: async (id: number): Promise<Usuario> => {
    const response = await apiClient.get<ApiResponse<Usuario>>(
      `/usuarios/${id}`
    );
    return response.data.data;
  },

  create: async (usuarioData: CreateUsuarioRequest): Promise<Usuario> => {
    const response = await apiClient.post<ApiResponse<Usuario>>(
      "/usuarios",
      usuarioData
    );
    return response.data.data;
  },

  update: async (
    id: number,
    usuarioData: UpdateUsuarioRequest
  ): Promise<Usuario> => {
    const response = await apiClient.put<ApiResponse<Usuario>>(
      `/usuarios/${id}`,
      usuarioData
    );
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/usuarios/${id}`);
  },

};

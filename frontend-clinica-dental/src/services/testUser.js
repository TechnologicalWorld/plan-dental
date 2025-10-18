import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL

export const testUsuarios = async () => {
  const response = await axios.get(`http://127.0.0.1:8000/api/usuarios`);  
  console.log(response.data);
  
  return response;
};

export interface Paciente {
  idUsuario_Paciente: number;
  codigoSeguro?: string | null;
  lugarNacimiento?: string | null;
  domicilio?: string | null;
  fechaIngreso?: string | null;
  usuario: {
    idUsuario: number;
    ci: string;
    nombre: string;
    paterno: string;
    materno?: string | null;
    correo: string;
    telefono: string;
    estado: boolean;
    fechaNacimiento?: string | null;
    genero?: 'M' | 'F' | 'Otro';
  };
}

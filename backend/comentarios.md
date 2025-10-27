# Comentarios sobre backend

1. La relacion **asiste**, **atiende**, **detalle-dental**, **tiene** no tiene id por lo que no se puede ni borrar ni actualizar ni obtener (me refiero a uno en especifico)
2. **Cita** pide como datos: idUsuario_Paciente e idUsuario_Odontologo pero estos no deberian de acuerdo al drawio y el documento
3. En Odontologo se esta pidiendo **id_especialidad** pero esta es una relacion N:M no una relacion 1:N
4. El endpoint **citas/{id}/cambiar-estado**, **citas/por-fecha/{fecha}**, **especialidades/{id}/odontologos**, **historias-clinicas/paciente/{pacienteId}** no existen

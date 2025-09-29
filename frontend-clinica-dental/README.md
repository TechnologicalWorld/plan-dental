# 🦷 Clínica Dental 

Aplicación web para administrar personal odontológico, pacientes, citas y reportes. Construida con **React + Vite**, **Material UI**, y una API simulada con **JSON Server**.

---

## 🚀 Instalación del proyecto

1. Clona el repositorio:

```bash
git clone https://github.com/esthsara/clinica-dental-frontend.git
cd clinica-dental-frontend

2. Instala Dependecias
npm install

Estas librerías ya están incluidas en el proyecto. Si clonas desde GitHub y ejecutas npm install, se instalarán automáticamente:

# UI y estilos
npm install @mui/material @emotion/react @emotion/styled

# Íconos
npm install @mui/icons-material

# Simulación de API
npm install --save-dev json-server

3. Ejecuta el servidor en una terminal parte

npm run mock:api

4. en otra terminal corrre el proyecto
npm run dev

5. Estrutura del proyecto
src/
├── components/       # Navbar, Sidebar, Layout
├── pages/            # Pantallas: Personal, Pacientes, Dashboard
├── services/         # Lógica de API: personalService.js, pacientesService.js
├── theme.js          # Tema personalizado de Material UI
├── App.jsx           # Punto de entrada
├── AppRoutes.jsx     # Rutas principales

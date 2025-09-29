import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import CharacterListContainer from '../pages/CharacterListContainer';
import Personal from '../pages/Personal';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/*<Route path="/" element={<CharacterListContainer />} />*/}
          <Route path="/dashboard" element={<h1>Dashboard</h1>} />
          <Route path="/personal" element={<Personal />} />
          <Route path="/pacientes" element={<h1>Gestión de Pacientes</h1>} />
          <Route path="/roles" element={<h1>Roles y Permisos</h1>} />
          <Route path="/calendarios" element={<h1>Calendarios</h1>} />
          <Route path="/reportes" element={<h1>Reportes</h1>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { UsuariosPage } from './features/usuarios/pages/UsuariosPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link 
                  to="/" 
                  className="text-xl font-bold text-gray-800 hover:text-gray-600"
                >
                  Clínica Dental
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link 
                  to="/" 
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Inicio
                </Link>
                <Link 
                  to="/usuarios" 
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Usuarios
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/usuarios" element={<UsuariosPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

// Página de inicio simple
const HomePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Sistema de Gestión Dental
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Gestión de Usuarios
            </h3>
            <p className="text-gray-600 mb-4">
              Administra pacientes, odontólogos y personal de la clínica
            </p>
            <Link 
              to="/usuarios" 
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Gestionar Usuarios
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Citas y Agenda
            </h3>
            <p className="text-gray-600 mb-4">
              Programa y gestiona citas de pacientes
            </p>
            <button 
              disabled
              className="inline-block bg-gray-400 text-white px-4 py-2 rounded-md cursor-not-allowed"
            >
              Próximamente
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Historias Clínicas
            </h3>
            <p className="text-gray-600 mb-4">
              Accede al historial médico de los pacientes
            </p>
            <button 
              disabled
              className="inline-block bg-gray-400 text-white px-4 py-2 rounded-md cursor-not-allowed"
            >
              Próximamente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
# 🦷 Clínica Dental — Sistema de Gestión

![Laravel](https://img.shields.io/badge/Laravel-10.x-FF2D20?style=for-the-badge&logo=laravel)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql)
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=nodedotjs)

Sistema web completo para la **gestión integral de una clínica dental**, desarrollado con arquitectura moderna y separación de responsabilidades.

## ✨ Características

### 🔐 Módulo de Autenticación

### 👥 Gestión de Usuarios

### 👥 Gestión de Pacientes

### 📅 Sistema de Citas

### 💰 Gestión Financiera

### 📊 Dashboard y Reportes

## 🏗️ Arquitectura del Sistema

```
clinicadental/
├── 📁 backend/          # API Laravel 10
│   ├── app/
│   ├── database/
│   ├── routes/
│   └── ...
├── 📁 frontend/         # React 18 + Vite
│   ├── src/
│   ├── components/
│   └── ...
└── 📁 documentation/    # Documentación adicional
```

## ⚙️ Requisitos Previos

### Software Requerido

| Software | Versión | Descripción |
|----------|---------|-------------|
| XAMPP | 8.1+ | Servidor web con PHP y MySQL |
| Composer | 2.x | Gestor de dependencias PHP |
| Node.js | 18.x+ | Entorno de ejecución JavaScript |


## 🚀 Instalación Completa

# Opción 1: Descargar ZIP
# Descomprimir y acceder a la carpeta

### 2. Configuración del Backend (Laravel)

```bash
# Navegar al directorio del backend
cd backend

# Instalar dependencias de Composer
composer install

# Copiar archivo de entorno
.env

# Configurar la base de datos en .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=clinica_dental
DB_USERNAME=root
DB_PASSWORD=

# Generar clave de aplicación
php artisan key:generate

# Ejecutar migraciones y seeders
php artisan migrate:fresh --seed
```
### 3. Configuración del Frontend (React)

```bash
# Navegar al directorio del frontend
cd ../frontend

# Instalar dependencias de Node.js
npm install


# Iniciar servidor de desarrollo
npm run dev
```

### 4. Configuración de la Base de Datos

1. Iniciar XAMPP y activar Apache y MySQL
2. Acceder a [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
3. Crear base de datos: `clinica_dental`
4. Las migraciones crearán las tablas automáticamente

## 👥 Roles y Permisos

### 🔑 Credenciales de Acceso por Defecto

| Rol | Email | Contraseña | Permisos |
|-----|-------|------------|----------|
| 🧑‍💼 **Administrador** | admin@clinicadental.com | admin123 |
| 🦷 **Odontólogo** | patricia.quisbert@email.com | password123 |
| 🧑 **Asistente** | asistente@gmail.com | password123 |
| 👩‍🦰 **Paciente** | maria.gonzalez@email.com | password123 |


## 🗂️ Estructura del Proyecto

### Backend (Laravel)

### Frontend (React)

## 🛠️ Desarrollo

### Comandos Útiles

#### Backend

```bash
# Ejecutar tests
php artisan test

# Ver rutas disponibles
php artisan route:list

# Limpiar cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

#### Frontend

```bash
# Ejecutar tests
npm test

# Ejecutar en modo desarrollo
npm run dev
```

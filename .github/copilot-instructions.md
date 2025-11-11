# Copilot Instructions: Plan-Dental

## Project Overview

**Plan-Dental** is a dental clinic management system with a **monorepo structure**:
- **Frontend** (React 19 + TypeScript + Vite): Patient/admin interfaces in `frontend/`
- **Backend** (Laravel 12 + PHP 8.2): REST API via Sanctum in `backend/`
- **Secondary Frontend** (legacy): `frontend-clinica-dental/` (React.js, older stack)

The system manages patients, dentists, appointments, treatments, and clinical records using a role-based access model.

---

## Architecture Patterns

### Database & Models (Backend)
- **Eloquent ORM** with custom primary keys (e.g., `idUsuario`, `idUsuario_Paciente`)
- **Pivot tables** for many-to-many relations: `asiste`, `atiende`, `hace`, `efectua`
- Models in `backend/app/Models/` follow naming: `Usuario`, `Paciente`, `Odontologo`, etc.
- **Role determination by relation presence**: Check `Usuario::isPaciente()`, `isOdontologo()`, etc.—no separate roles table

**Example pattern** (`backend/app/Models/Usuario.php`):
```php
public function isOdontologo() { return $this->odontologo !== null; }
public function getRoles() { /* Returns array of role strings */ }
```

### Controllers & API Routes
- **Controller per resource** in `backend/app/Http/Controllers/`: `CitaController`, `PacienteController`, etc.
- **Most endpoints use RESTful apiResource()** in `backend/routes/api.php`
- **Special cases**: Custom methods like `/citas/{id}/cambiar-estado`, `/odontologos/{id}/asignar-especialidades`
- **Stored procedures for reports**: `ReportesController` calls MySQL procedures (e.g., `CALL obtener_ingresos_y_pendientes()`)

### Authentication & Authorization
- **Laravel Sanctum** for API token auth (stateless)
- **No built-in middleware role check yet**—implementation uses `middleware('role:paciente')` syntax in routes but verify it's custom-implemented
- **Auth flow**: POST `/login` → returns `token`, `usuario` (with relations), `roles` array
- **Token persistence**: Frontend stores in `localStorage` (key: `pd_token`)

---

## Frontend Stack & Patterns

### Build & Environment
- **Framework**: React 19 + TypeScript (strict mode)
- **Build tool**: Vite 7 with SWC for JSX transformation
- **Styling**: Tailwind CSS 4 + custom CSS modules
- **Alias**: `@` → `src/` (configured in `vite.config.ts`)
- **Environment**: `VITE_API_URL` env var; defaults to `http://127.0.0.1:8000` if unset

### API Client (`src/shared/api/apiClient.ts`)
- **Axios instance** with Bearer token auto-injection
- **Single source of truth** for auth: `setAuthToken(token)` updates both localStorage and axios headers
- **Hydration on load**: Reads `pd_token` from localStorage on startup
- **Interceptors**:
  - Auto-sets `Authorization: Bearer <token>` on all requests
  - 401 responses auto-logout (clear token)
  - Error responses standardize to `.message` field

### State Management
- **Zustand** for global state (lighter than Redux)
- **React Router v7** for navigation
- **React Hook Form** + **Zod** for form validation

### Structure
- `src/features/` → Feature modules (e.g., `usuarios/`, `auth/`, `pacientes/`)
- `src/shared/` → Reusable: `api/`, `ui/`, `hooks/`, `config/`, `utils/`
- `src/types/` → TypeScript interfaces (e.g., `asistente.ts`, `auth.ts`)
- `src/pages/` → Page-level components (Dashboard, Reportes, etc.)
- `src/entities/` → Domain models

---

## Development Workflows

### Backend Setup & Commands
```bash
cd backend
composer install
php artisan migrate              # Create tables
php artisan db:seed              # Optional: seed data
php artisan serve               # Start Laravel on :8000
```

### Frontend Setup & Commands
```bash
cd frontend
npm install
npm run dev                      # Vite dev server (typically :5173)
npm run build                   # Optimize build
npm run lint                    # ESLint check
```

### Full Stack Dev (from `backend/composer.json`)
```bash
composer run dev  # Runs Laravel serve, queue listener, logs, and Vite concurrently
```

### Testing
```bash
cd backend
composer run test   # Runs phpunit after clearing config cache
```

---

## Critical Developer Notes

### 1. **Role-Based Access**
- Roles are **derived from presence** of related models (no RBAC table)
- When creating users, you must explicitly create the corresponding role record (e.g., `Paciente::create()`)
- Check `Usuario::getRoles()` returns expected roles after creation

### 2. **Custom Primary Keys**
- Tables use non-standard PKs: `idUsuario`, `idUsuario_Paciente`, `idOdontograma`, etc.
- Eloquent models **must declare** `protected $primaryKey` and `protected $keyType`
- When storing relations, **use the exact foreign key names** (e.g., `idUsuario_Odontologo`, not `odontologo_id`)

### 3. **API Response Format**
- Login/Register: Returns `{ token, usuario, roles }`
- Errors: `{ success: false, message, errors: { field: [messages] } }`
- Validation errors from Laravel include field-level details

### 4. **Frontend Token Management**
- Always use `apiClient` from `src/shared/api/apiClient.ts`, not bare axios
- Call `setAuthToken(token)` **immediately after login**, not just storing in localStorage
- On app boot, hydration reads localStorage automatically

### 5. **Dashboard & Reports**
- Reportes page aggregates data from `DashboardController` endpoints
- Some endpoints paginate: use `limit` and `offset` query params if needed
- Charts built with **Recharts** (`src/pages/Reportes.tsx`, `DashboardReportDownload.tsx`)

### 6. **Timestamps & Date Handling**
- Backend uses `$casts = ['fecha' => 'date']` for auto-conversion
- Frontend receives ISO strings; convert with `new Date()` for display
- Some pivot tables store `fecha` in the relationship

---

## Common Pitfalls & Checklist

**Backend:**
- ✅ Verify custom primary keys are set on all models
- ✅ Stored procedures exist in database before calling from controllers
- ✅ Sanctum guard configured (check `config/sanctum.php`)
- ✅ CORS enabled if frontend is on different origin (check middleware)

**Frontend:**
- ✅ `VITE_API_URL` set in `.env` or uses default `http://127.0.0.1:8000`
- ✅ Token retrieved & used via `apiClient`, not direct axios
- ✅ TypeScript paths (`@/*`) resolve correctly in imports
- ✅ Tailwind purge includes all template paths in `tailwind.config.ts`

**Integration:**
- ✅ Backend CORS middleware allows frontend origin
- ✅ Frontend interceptor handles 401s (auto-logout) correctly
- ✅ API route prefix (`/api/`) matches frontend base URL

---

## Reference Files

| Component | File(s) |
|-----------|---------|
| **Auth Logic** | `backend/app/Http/Controllers/AuthController.php`, `backend/config/auth.php` |
| **User Model** | `backend/app/Models/Usuario.php` |
| **API Routes** | `backend/routes/api.php` (150+ lines) |
| **Frontend Auth** | `src/shared/api/apiClient.ts`, auth features |
| **Reporting** | `backend/app/Http/Controllers/DashboardController.php`, `backend/app/Http/Controllers/ReportesController.php` |
| **Forms** | Feature modules use React Hook Form + Zod (see `src/features/`) |

---

**Last Updated**: November 2025  
**Stack**: Laravel 12, React 19, Sanctum, Zustand, Tailwind 4, Vite 7

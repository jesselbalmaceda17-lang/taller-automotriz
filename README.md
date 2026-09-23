# Taller Automotriz

Sistema web para la gestión de clientes, vehículos e ítems de un taller
automotriz. El proyecto está dividido en una API Laravel y una aplicación
frontend React + Vite.

## Estructura

```text
backend/    API Laravel 13, autenticación con Sanctum y SQLite
frontend/   Aplicación React con Vite
```

## Requisitos

- PHP 8.3 o superior
- Composer
- Node.js y npm
- Git

## Instalación

### Backend

```bash
cd backend
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

En macOS/Linux, reemplaza `copy` por:

```bash
cp .env.example .env
```

La API quedará disponible en `http://localhost:8000`.

### Frontend

En otra terminal:

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

En macOS/Linux, reemplaza `copy` por:

```bash
cp .env.example .env
```

La aplicación quedará disponible en la URL que muestre Vite, normalmente
`http://localhost:5173`.

## Variables de entorno

### Backend

El archivo `backend/.env` se crea a partir de `backend/.env.example` y no debe
publicarse. Para el entorno local se utiliza SQLite:

```dotenv
APP_URL=http://localhost:8000
DB_CONNECTION=sqlite
```

`php artisan key:generate` completa `APP_KEY` automáticamente.

### Frontend

Crea `frontend/.env` con la URL base de la API:

```dotenv
VITE_API_URL=http://localhost:8000/api
```

Los archivos `.env` reales están excluidos por el `.gitignore`.

## Base de datos y migraciones

Para crear o actualizar las tablas:

```bash
cd backend
php artisan migrate
```

Para ejecutar las migraciones y los datos de prueba desde cero:

```bash
php artisan migrate:fresh --seed
```

El seeder crea clientes de ejemplo y el usuario de prueba indicado abajo.

## Comandos útiles

### Backend

```bash
php artisan serve
php artisan migrate:status
php artisan migrate --seed
php artisan test
```

### Frontend

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Usuario de prueba

Después de ejecutar `php artisan migrate --seed`, está disponible el usuario:

```text
Correo: test@example.com
Contraseña: password
```

Estas credenciales son únicamente para desarrollo local y no deben utilizarse
en un entorno público o de producción.

## API principal

La API utiliza el prefijo `/api`:

- `POST /api/login`
- `POST /api/logout`
- `GET /api/clientes`
- Operaciones CRUD en `/api/vehiculos`
- Operaciones CRUD en `/api/items`

Las rutas protegidas requieren el token emitido por el endpoint de login.

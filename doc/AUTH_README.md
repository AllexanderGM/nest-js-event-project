# Autenticación JWT y guard global

_Volver al [índice de documentación](./README.md)._ 

Este módulo protege toda la API y sirve como ejemplo de cómo estructurar autenticación en NestJS con Passport, JWT y decoradores personalizados.

## Qué se implementó

- Entidad `User` con email único, contraseña hasheada (bcrypt) y campos de perfil utilizados en el curso.
- DTOs `LoginDto` y `RegisterDto` con validaciones amigables.
- `AuthService`, `AuthController` y `AuthModule` con dependencias declaradas.
- Estrategia `JwtStrategy`, guard global `JwtAuthGuard` y decoradores `@Public()` / `@GetUser()`.
- Variables JWT en `.env`:
  ```env
  JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
  JWT_EXPIRES_IN=7d
  ```

En `AppModule` se registra `APP_GUARD` con `JwtAuthGuard`, así que cualquier endpoint nuevo será privado hasta que le añadas `@Public()`.

## Endpoints principales

| Método | Ruta | Descripción | Decoradores |
|--------|------|-------------|-------------|
| `POST` | `/auth/register` | Crea usuario + token | `@Public()` |
| `POST` | `/auth/login` | Valida credenciales y devuelve token | `@Public()` |
| `GET` | `/auth/profile` | Retorna al usuario autenticado | Guard global + `@GetUser()` |

### Registro de usuario

```http
POST /auth/register
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123",
  "displayName": "Estudiante",
  "avatarUrl": "https://i.pravatar.cc/150?img=1",
  "originWorld": "Earth-1218"
}
```

Respuesta esperada:

```json
{
  "access_token": "<jwt>",
  "user": {
    "id": 1,
    "email": "student@example.com",
    "displayName": "Estudiante",
    "avatarUrl": "https://i.pravatar.cc/150?img=1",
    "originWorld": "Earth-1218",
    "isAlive": true
  }
}
```

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123"
}
```

Respuesta idéntica al registro (token + datos básicos del usuario).

### Perfil

```http
GET /auth/profile
Authorization: Bearer <jwt>
```

Devuelve la entidad `User` con metadatos (`createdAt`, `updatedAt`).

## Flujo rápido en Postman

1. Importa `events.postman_collection.json`.
2. Ejecuta “Registro de usuario” → guarda `{{authToken}}` automáticamente.
3. Si ya te registraste, ejecuta “Login” para renovar el token.
4. El resto de endpoints (`/events`, `/bookings`, etc.) usan el header `Authorization: Bearer {{authToken}}`.

## Hacer rutas públicas

```ts
import { Public } from '../auth/decorators/public.decorator';

@Controller('status')
export class StatusController {
  @Public()
  @Get()
  ping() {
    return { ready: true };
  }
}
```

## Consejos para extenderlo

- Usa `@GetUser()` en tus controladores para acceder al usuario autenticado sin volver a consultar la base de datos.
- Si necesitas roles/permisos, crea un decorador adicional que lea claims del JWT en el guard y lánzalo desde `handleRequest`.
- ¿Login no devuelve token? Sigue la guía de [debug](DEBUG_LOGIN.md) antes de cambiar código.

Con este módulo en su lugar puedes enfocar las siguientes clases solo en la lógica de negocio, sabiendo que toda la API exige autenticación por defecto.

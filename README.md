# EventPulse API · Base del Curso NestJS

Esta es la API que usamos durante las asesorías de KeyCode. Sirve como ejemplo completo para que practiques conceptos de NestJS, TypeORM y buenas prácticas modernas en un backend realista. A partir de este código puedes construir tu propio proyecto: todas las secciones están documentadas y hay scripts que aceleran tu flujo de trabajo.

## ¿Qué incluye?

- Gestión de eventos con TypeORM, validaciones y subida de imágenes locales
- Autenticación JWT y guard global para proteger los módulos
- Reservas (bookings) que vinculan usuarios con eventos
- Semillas, seeds orquestadas y colección de Postman lista para usar
- Configuración para correr en local o enteramente con Docker
- Tests unitarios + e2e como referencia

## Stack principal

| Capa | Tecnología |
|------|------------|
| Framework | NestJS 11 + TypeScript |
| Persistencia | TypeORM + MySQL 8 (docker-compose) |
| Autenticación | Passport + JWT |
| Storage local | `public/uploads/events` servido con `@nestjs/serve-static` |
| Utilidades | class-validator, class-transformer, Multer, uuid |

## Arquitectura del proyecto

```
src/
├── app.module.ts            # Configura módulos globales y guard JWT
├── main.ts                  # Arranque HTTP y pipes globales
├── auth/                    # Registro, login, estrategia JWT
├── booking/                 # Reservas ligadas a usuarios y eventos
├── event/                   # CRUD de eventos + subida de imágenes
├── user/                    # Entidad base (se usa vía TypeORM)
├── common/                  # Configuración de Multer y utilidades
└── database/                # Seeds y helpers para TypeORM
```

Documentación detallada de cada módulo en [`doc/`](doc/README.md).

## Preparación rápida

1. **Clonar y entrar**
   ```bash
   git clone <tu-fork>
   cd Asesorias
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables**
   ```bash
   cp .env.example .env
   # Ajusta puertos y contraseñas según tu entorno
   ```

4. **Levantar base de datos**
   ```bash
   # Solo MySQL
   docker compose up -d db
   ```

5. **Arrancar la API con recarga automática**
   ```bash
   npm run start:dev
   ```

6. **(Opcional) Sembrar datos de ejemplo**
   ```bash
   npm run seed:run
   # o solamente eventos
   npm run seed:events
   ```

## Variables de entorno principales

| Clave | Descripción | Valor por defecto |
|-------|-------------|-------------------|
| `NODE_ENV` | Entorno (`development`, `production`) | `development` |
| `PORT` | Puerto HTTP de Nest | `3000` |
| `DB_HOST` / `DB_PORT` | Conexión MySQL | `localhost` / `3308` |
| `DB_USER` / `DB_PASSWORD` / `DB_NAME` | Credenciales de la app | `user` / `soy_una_contrasenia_segura` / `mydatabase` |
| `DB_ROOT_PASSWORD` | Solo para docker-compose | `root_password` |
| `JWT_SECRET` / `JWT_EXPIRES_IN` | Tokenización JWT | Ver `.env.example` |
| `UPLOAD_DESTINATION` | Ruta para imágenes | `./public/uploads/events` |
| `MAX_FILE_SIZE` / `MAX_FILES_COUNT` | Validaciones de Multer | `5MB` / `5` |

> El proyecto usa `@nestjs/config`, por lo que cualquier cambio en `.env` requiere reiniciar `npm run start:dev`.

## Ejecutar la aplicación

### Desarrollo híbrido (recomendado durante el curso)

1. `docker compose up -d db`
2. `npm run start:dev`
3. Importa `events.postman_collection.json` y prueba desde Postman usando la variable `{{baseUrl}} = http://localhost:3000`.

### Todo en Docker

```bash
docker compose --profile full up -d
# Revisa logs con
docker compose logs -f app
```

El servicio `app` se monta con código en vivo (`./src:/app/src`) para permitir hot reload.

## Scripts útiles

- `npm run start:prod` → usa `dist/`, ideal para validar build.
- `npm run build` → compila a JavaScript.
- `npm run lint` → aplica ESLint/Prettier.
- `npm run test`, `test:watch`, `test:e2e` → referencia en [`doc/TEST_README.md`](doc/TEST_README.md).
- `npm run seed:events` y `seed:run` → scripts TS que se apoyan en `src/database/seeds`.

## Postman y flujos base

La colección `events.postman_collection.json` cubre:

1. Registro y login (`/auth/register`, `/auth/login`)
2. CRUD de eventos con subida de imágenes
3. Reservas (`/bookings`)

Ejecuta “Registro de usuario” → “Login” → “Listar eventos” para dejar variables listas (`{{authToken}}`, `{{eventId}}`).

## Documentación del curso

- [Autenticación JWT y guard global](doc/AUTH_README.md)
- [Bookings y relación con eventos](doc/BOOKING_README.md)
- [DTOs y validación con archivos](doc/DTO_VALIDATION.md)
- [Subida de imágenes y configuración de Multer](doc/IMAGE_UPLOAD.md)
- [Lifecycle hooks y normalización de datos](doc/LIFECYCLE_HOOKS.md)
- [Linting aplicado al file upload](doc/ESLINT_MULTER_CONFIG.md)
- [Diagnóstico de login](doc/DEBUG_LOGIN.md)
- [Guía de tests](doc/TEST_README.md)

Cada documento puede leerse de forma independiente, pero todos parten del índice en [`doc/README.md`](doc/README.md).

## Próximos pasos sugeridos

1. Implementar filtros y paginación en `/events`.
2. Añadir módulos propios (por ejemplo, notificaciones) reutilizando autenticación y DTOs existentes.
3. Configurar CI/CD o GitHub Actions que ejecuten `npm run lint` y `npm run test`.
4. Documentar tu API con Swagger a partir de los DTOs ya creados.

¡Explora, rompe cosas y vuelve a armar! Esta base está pensada para que experimentes sin miedo.

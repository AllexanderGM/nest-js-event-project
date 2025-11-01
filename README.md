# API de Gestión de Eventos - NestJS

Aplicación backend desarrollada con NestJS, TypeORM y MySQL para la gestión de eventos y usuarios.

## Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Endpoints](#api-endpoints)
- [Docker](#docker)
- [Scripts Disponibles](#scripts-disponibles)

## Características

- ✅ CRUD completo de eventos
- ✅ Integración con API externa (Rick and Morty)
- ✅ Validación automática de datos con class-validator
- ✅ Base de datos MySQL con TypeORM
- ✅ Variables de entorno configurables
- ✅ Docker y Docker Compose
- ✅ Hot-reload en desarrollo
- ✅ Código completamente documentado

## Tecnologías

- **Framework:** NestJS 11
- **ORM:** TypeORM
- **Base de Datos:** MySQL 8.0
- **Validación:** class-validator, class-transformer
- **Configuración:** @nestjs/config
- **Containerización:** Docker & Docker Compose

## Requisitos Previos

- Node.js 20 o superior
- npm o yarn
- Docker y Docker Compose (para ejecutar con contenedores)

## Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd Asesorias
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita el archivo .env con tus configuraciones
```

## Configuración

### Variables de Entorno

El proyecto usa un archivo `.env` para la configuración. Las variables disponibles son:

```env
# Aplicación
NODE_ENV=development
PORT=3000

# Base de Datos
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3308
DB_USER=user
DB_PASSWORD=soy_una_contrasenia_segura
DB_NAME=mydatabase

# MySQL Root Password (solo para Docker)
DB_ROOT_PASSWORD=root_password
```

### Base de Datos

La aplicación usa TypeORM con sincronización automática de entidades:

- **synchronize: true** - Crea/actualiza automáticamente las tablas en la BD
- **ADVERTENCIA:** En producción debe ser `false` para evitar pérdida de datos

## Uso

### Desarrollo Local

1. **Opción 1: Solo Base de Datos en Docker**
```bash
# Levanta solo MySQL en Docker
docker-compose up -d

# Ejecuta la aplicación localmente
npm run start:dev
```

2. **Opción 2: Todo en Docker**
```bash
# Levanta base de datos y aplicación
docker-compose --profile full up -d
```

### Producción

```bash
# Construye el proyecto
npm run build

# Ejecuta en modo producción
npm run start:prod
```

## Estructura del Proyecto

```
src/
├── event/                          # Módulo de Eventos
│   ├── dto/                        # Data Transfer Objects
│   │   ├── create-event.dto.ts     # DTO para crear eventos
│   │   └── update-event.dto.ts     # DTO para actualizar eventos
│   ├── entities/                   # Entidades de TypeORM
│   │   └── event.entity.ts         # Entidad Event
│   ├── event.controller.ts         # Controlador REST
│   ├── event.service.ts            # Lógica de negocio
│   └── event.module.ts             # Módulo de eventos
│
├── user/                           # Módulo de Usuarios
│   ├── dto/                        # Data Transfer Objects
│   │   ├── user.dto.ts             # DTO de usuario
│   │   ├── create-user.dto.ts      # DTO para crear usuarios
│   │   └── update-user.dto.ts      # DTO para actualizar usuarios
│   ├── entities/                   # Entidades de TypeORM
│   │   └── user.entity.ts          # Entidad User
│   ├── mappers/                    # Transformadores de datos
│   │   └── user.mapper.ts          # Mapper de API externa
│   ├── user.service.ts             # Servicio (consulta API externa)
│   └── user.module.ts              # Módulo de usuarios
│
├── app.module.ts                   # Módulo raíz de la aplicación
└── main.ts                         # Punto de entrada de la aplicación
```

### Descripción de Capas

#### Entidades (Entities)
Definen la estructura de las tablas en la base de datos usando TypeORM.
- Decoradores: `@Entity`, `@Column`, `@PrimaryGeneratedColumn`
- Mapean clases TypeScript a tablas SQL

#### DTOs (Data Transfer Objects)
Definen la estructura de datos para peticiones HTTP.
- Validaciones automáticas con `class-validator`
- Tipos seguros para entrada/salida de datos

#### Servicios (Services)
Contienen la lógica de negocio de la aplicación.
- Operaciones CRUD
- Transformación de datos
- Integración con APIs externas

#### Controladores (Controllers)
Manejan las peticiones HTTP y definen los endpoints REST.
- Decoradores: `@Get`, `@Post`, `@Patch`, `@Delete`
- Delegan la lógica a los servicios

#### Módulos (Modules)
Organizan la aplicación en bloques funcionales.
- Importan dependencias
- Exportan servicios para otros módulos

## API Endpoints

### Eventos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/events` | Crear un nuevo evento |
| GET | `/events` | Obtener todos los eventos |
| GET | `/events/:id` | Obtener un evento por ID |
| PATCH | `/events/:id` | Actualizar un evento |
| DELETE | `/events/:id` | Eliminar un evento |

#### Ejemplos de Peticiones

**Crear Evento:**
```bash
POST http://localhost:3000/events
Content-Type: application/json

{
  "title": "Conferencia de NestJS",
  "description": "Aprende a usar NestJS con TypeORM",
  "date": "2025-01-15T10:00:00Z",
  "location": "Auditorio Principal"
}
```

**Actualizar Evento:**
```bash
PATCH http://localhost:3000/events/{id}
Content-Type: application/json

{
  "title": "Nueva Conferencia de NestJS",
  "location": "Auditorio Central"
}
```

**Obtener Todos los Eventos:**
```bash
GET http://localhost:3000/events
```

**Eliminar Evento:**
```bash
DELETE http://localhost:3000/events/{id}
```

### Validaciones

Los DTOs incluyen validaciones automáticas:

- `@IsString()` - Debe ser texto
- `@IsNotEmpty()` - No puede estar vacío
- `@IsOptional()` - Campo opcional
- `@IsDateString()` - Debe ser fecha válida (ISO 8601)
- `@MaxLength(n)` - Longitud máxima

Si envías datos inválidos, recibirás un error `400 Bad Request` con detalles.

## Docker

### Perfiles de Docker Compose

El proyecto está configurado con perfiles de Docker Compose para diferentes escenarios de uso:

#### 1. Solo Base de Datos (por defecto)
Levanta únicamente el contenedor de MySQL. Útil para desarrollo local cuando quieres ejecutar la aplicación NestJS directamente en tu máquina.

```bash
# Levantar solo MySQL
docker-compose up -d

# o específicamente
docker-compose up db
```

**Ventajas:**
- Hot-reload más rápido
- Mejor experiencia de desarrollo
- Debugging más sencillo

**Flujo recomendado para desarrollo:**
```bash
# 1. Levantar solo la base de datos
docker-compose up -d

# 2. Ejecutar la aplicación localmente
npm run start:dev
```

#### 2. Aplicación Completa (perfil: full)
Levanta tanto la base de datos como la aplicación NestJS en contenedores. Útil para testing completo o entornos similares a producción.

```bash
# Levantar todo (base de datos + aplicación)
docker-compose --profile full up -d
```

### Comandos Docker Útiles

```bash
# Ver logs en tiempo real
docker-compose logs -f

# Ver logs solo de la base de datos
docker-compose logs -f db

# Ver logs solo de la aplicación
docker-compose --profile full logs -f app

# Detener servicios (solo BD)
docker-compose down

# Detener servicios (aplicación completa)
docker-compose --profile full down

# Reconstruir imágenes
docker-compose --profile full up --build

# Eliminar volúmenes (⚠️ CUIDADO: elimina todos los datos!)
docker-compose down -v

# Reiniciar un servicio específico
docker-compose restart db

# Ver estado de los contenedores
docker-compose ps
```

### Health Checks

El contenedor de MySQL incluye health checks automáticos para asegurar que la base de datos esté lista antes de que la aplicación intente conectarse:

```yaml
healthcheck:
  test: ['CMD', 'mysqladmin', 'ping', '-h', 'localhost']
  interval: 10s
  timeout: 5s
  retries: 5
```

### Volúmenes

Los datos de MySQL se persisten en un volumen Docker:
```yaml
volumes:
  mysql_data:
```

Esto asegura que tus datos no se pierdan al detener los contenedores.

## Scripts Disponibles

```bash
# Desarrollo
npm run start:dev          # Inicia en modo desarrollo con hot-reload
npm run start:debug        # Inicia en modo debug

# Producción
npm run build              # Construye el proyecto
npm run start:prod         # Ejecuta en modo producción

# Testing
npm run test               # Ejecuta tests unitarios
npm run test:watch         # Tests en modo watch
npm run test:cov           # Tests con cobertura
npm run test:e2e           # Tests end-to-end

# Linting y Formato
npm run lint               # Ejecuta ESLint con auto-fix
npm run format             # Formatea el código con Prettier

# Semillas (Seeds)
npm run seed:events        # Crea 10 eventos de ejemplo en la BD
npm run seed:run          # Ejecuta cualquier semilla especificada
```

## Semillas de Base de Datos (Database Seeds)

Las semillas permiten poblar la base de datos con datos de ejemplo para desarrollo y testing.

### Ejecutar semilla de eventos

```bash
npm run seed:events
```

Este comando:
1. Se conecta a la base de datos usando las variables del archivo `.env`
2. Verifica si los eventos ya existen (por título)
3. Crea solo los eventos que no existen
4. Muestra un reporte detallado

**Ejemplo de salida:**
```
🌱 Iniciando semilla de eventos...
✅ Conexión a la base de datos establecida
📊 Eventos existentes en la base de datos: 0
📝 Creando eventos de ejemplo...

✅ Creado: "Conferencia de NestJS 2025"
   📅 Fecha: 15/3/2025
   📍 Lugar: Centro de Convenciones

🎉 Semilla completada exitosamente!
📊 Eventos creados: 10
📊 Total de eventos en BD: 10
```

### Eventos de ejemplo incluidos

1. Conferencia de NestJS 2025
2. Workshop de TypeScript Avanzado
3. Hackathon de APIs RESTful
4. Meetup: Arquitectura de Microservicios
5. Webinar: Seguridad en Aplicaciones Node.js
6. Bootcamp de Testing con Jest
7. Conferencia: GraphQL vs REST
8. Taller de Bases de Datos SQL y NoSQL
9. Summit de Desarrollo Backend 2025
10. Code Review: Mejores Prácticas

### Características de las semillas

- ✅ **Prevención de duplicados** - No crea eventos que ya existen
- ✅ **Idempotente** - Puedes ejecutarlo múltiples veces
- ✅ **Datos realistas** - Eventos con fechas, ubicaciones y descripciones detalladas
- ✅ **Reportes visuales** - Output con emojis y estadísticas

### Crear nuevas semillas

Para crear una nueva semilla, sigue esta estructura básica en `src/database/seeds/`:

```typescript
import { DataSource } from 'typeorm';
import { MiEntidad } from '../../mi-modulo/entities/mi-entidad.entity';

const datosDeEjemplo = [
  // ... tus datos aquí
];

async function runSeed() {
  console.log('🌱 Iniciando semilla...\n');

  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3308'),
    username: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'soy_una_contrasenia_segura',
    database: process.env.DB_NAME || 'mydatabase',
    entities: [MiEntidad],
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    const repository = dataSource.getRepository(MiEntidad);

    // Lógica de inserción aquí

    console.log('🎉 Semilla completada!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

runSeed();
```

Luego agrega un script en `package.json`:
```json
"seed:mi-semilla": "ts-node -r tsconfig-paths/register src/database/seeds/mi-semilla.seed.ts"
```

### Troubleshooting de Seeds

**Error: Connection refused**
- Verifica que Docker esté corriendo: `docker-compose ps`
- Verifica las variables en `.env`
- Comprueba que el puerto esté disponible

**Error: Access denied for user**
- Verifica las credenciales en `.env`
- Ejecuta: `docker-compose down -v && docker-compose up -d`

## Colección de Postman

El proyecto incluye una colección completa de Postman para probar todos los endpoints del API.

### Importar la Colección

1. Abre Postman
2. Click en **"Import"**
3. Selecciona el archivo `eventpulse.postman_collection.json`
4. La colección aparecerá en tu sidebar

### Estructura de la Colección

La colección está organizada en carpetas:

#### 1. Eventos
Operaciones CRUD completas:
- ✅ **Crear evento** - POST /events
- ✅ **Listar eventos** - GET /events
- ✅ **Obtener evento por ID** - GET /events/:id
- ✅ **Actualizar evento** - PATCH /events/:id
- ✅ **Eliminar evento** - DELETE /events/:id

#### 2. Tests de Validación
Verifican que las validaciones funcionen correctamente:
- ❌ **Crear evento sin título** - Debe fallar con error 400
- ❌ **Crear evento con fecha inválida** - Debe fallar con error 400

### Variables de Entorno

La colección usa las siguientes variables:

- **baseUrl**: `http://localhost:3000` - URL base del API
- **eventId**: Se auto-genera al crear o listar eventos

#### Auto-guardado de eventId

Cuando ejecutas **"Listar eventos"** o **"Crear evento"**, el ID del evento se guarda automáticamente en la variable `{{eventId}}` para usarlo en las siguientes peticiones.

### Tests Automáticos

Cada petición incluye tests que se ejecutan automáticamente:

#### Crear evento
```javascript
✅ Status code es 201 Created
✅ Response es JSON
✅ Evento creado tiene los campos requeridos
✅ ID del evento guardado en variable
```

#### Listar eventos
```javascript
✅ Status code es 200 OK
✅ Response es un array
✅ Hay eventos en la base de datos
✅ ID del primer evento guardado
```

#### Obtener evento por ID
```javascript
✅ Status code es 200 OK o 404 Not Found
✅ Evento tiene la estructura correcta
✅ Mensaje de error cuando no se encuentra
```

### Flujo de Trabajo con Postman

1. **Primera vez - Configurar base de datos**
   ```bash
   npm run seed:events
   ```

2. **Listar eventos existentes**
   - Ejecuta **"Listar eventos"** para ver todos y auto-guardar el primer ID

3. **Probar operaciones CRUD**
   - Ejecuta en este orden:
     1. **Crear evento** - Crea un nuevo evento
     2. **Obtener evento por ID** - Verifica que se creó
     3. **Actualizar evento** - Modifica el evento
     4. **Listar eventos** - Ve todos los cambios
     5. **Eliminar evento** - Elimina el evento de prueba

4. **Ejecutar todos los tests**
   - Click derecho en la colección
   - **"Run collection"**
   - Click **"Run API de Gestión de Eventos"**
   - Verás un reporte: `✅ 15/15 tests passed`

### Ejemplos de Peticiones

#### Crear un evento
```json
POST http://localhost:3000/events

{
  "title": "Conferencia de Node.js 2025",
  "description": "Aprende las últimas novedades de Node.js",
  "date": "2025-06-15T09:00:00.000Z",
  "location": "Centro de Convenciones"
}
```

**Respuesta (201 Created):**
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "title": "Conferencia de Node.js 2025",
  "description": "Aprende las últimas novedades de Node.js",
  "date": "2025-06-15T09:00:00.000Z",
  "location": "Centro de Convenciones",
  "createdAt": "2025-01-01T12:00:00.000Z",
  "updatedAt": "2025-01-01T12:00:00.000Z"
}
```

#### Actualizar un evento
```json
PATCH http://localhost:3000/events/{{eventId}}

{
  "title": "Conferencia de Node.js 2025 - ACTUALIZADA",
  "location": "Nuevo Centro de Convenciones"
}
```

#### Eliminar un evento
```
DELETE http://localhost:3000/events/{{eventId}}
```
**Respuesta:** 204 No Content (sin contenido en el body)

### Casos de Validación

#### Error: Campo obligatorio faltante
```json
POST http://localhost:3000/events

{
  "description": "Sin título",
  "date": "2025-12-31T10:00:00.000Z"
}
```

**Respuesta (400 Bad Request):**
```json
{
  "statusCode": 400,
  "message": [
    "title should not be empty",
    "title must be a string"
  ],
  "error": "Bad Request"
}
```

#### Error: Fecha inválida
```json
POST http://localhost:3000/events

{
  "title": "Evento de prueba",
  "date": "fecha-invalida"
}
```

**Respuesta (400 Bad Request):**
```json
{
  "statusCode": 400,
  "message": [
    "date must be a valid ISO 8601 date string"
  ],
  "error": "Bad Request"
}
```

### Troubleshooting de Postman

**Error: "Could not get any response"**
- Problema: La aplicación no está corriendo
- Solución: `npm run start:dev`

**Error: "Network Error"**
- Problema: La URL base está incorrecta
- Solución: Verifica que `baseUrl` sea `http://localhost:3000`

**Error: "Event with id X was not found"**
- Problema: El evento no existe en la BD
- Solución: Ejecuta "Listar eventos" primero o crea un nuevo evento

**Tests fallan después de eliminar eventos**
- Problema: La base de datos está vacía
- Solución: `npm run seed:events`

### Tips de Postman

1. **Usa el Collection Runner** para ejecutar todos los tests automáticamente
2. **Verifica la consola de Postman** para ver logs de los tests
3. **Los IDs se guardan automáticamente** - No necesitas copiar y pegar UUIDs
4. **Ejecuta "Listar eventos" primero** para auto-poblar el eventId
5. **Los tests te dirán si algo falla** - Revisa la pestaña "Test Results"

## Características Técnicas

### TypeORM

- **Sincronización automática:** Las entidades se sincronizan automáticamente con la BD
- **Migraciones:** En producción se recomienda usar migraciones en lugar de `synchronize: true`
- **Repositorio Pattern:** Acceso a datos mediante repositorios de TypeORM

### Validación

- **ValidationPipe global:** Valida automáticamente todos los DTOs
- **whitelist:** Elimina propiedades no definidas
- **forbidNonWhitelisted:** Rechaza peticiones con propiedades extras
- **transform:** Transforma tipos automáticamente

### Configuración

- **ConfigModule:** Gestión centralizada de variables de entorno
- **isGlobal:** ConfigService disponible en toda la aplicación
- **Valores por defecto:** Fallbacks para todas las variables

## Próximos Pasos

- [ ] Implementar autenticación (JWT)
- [ ] Agregar paginación en endpoints de listado
- [ ] Implementar filtros y búsqueda
- [ ] Agregar tests unitarios y e2e
- [ ] Implementar migraciones de BD
- [ ] Documentación con Swagger/OpenAPI
- [ ] Implementar logging estructurado

## Licencia

Este proyecto es privado y no tiene licencia pública.

## Autor

Desarrollado para fines educativos - KeyCode - NestJS

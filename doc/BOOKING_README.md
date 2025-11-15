# Módulo de reservas (bookings)

_Volver al [índice de documentación](./README.md)._ 

El módulo de reservas conecta usuarios autenticados con eventos existentes. Aquí encuentras la estructura mínima para crear, consultar y actualizar bookings.

## Estructura general

- **Entidad** `Booking`: relaciona `user` (ManyToOne) y `event` (ManyToOne). Campos: `status` (`pending`, `confirmed`, `cancelled`), `notes`, timestamps.
- **DTOs**: `CreateBookingDto` recibe `eventId` + `notes`; `UpdateBookingDto` permite modificar `status` y notas.
- **Service**: valida que el evento exista, evita duplicados y aplica reglas de ownership.
- **Controller**: rutas protegidas automáticamente por el guard JWT. Usa `@GetUser()` para obtener el `userId` del token.

## Endpoints disponibles

Base URL: `http://localhost:3000` (usa el token obtenido en `/auth/login`).

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/bookings` | Crea una reserva para el usuario autenticado |
| `GET` | `/bookings` | Lista todas tus reservas |
| `GET` | `/bookings/:id` | Obtiene una reserva específica si te pertenece |
| `PATCH` | `/bookings/:id` | Actualiza estado o notas (solo propietario) |
| `DELETE` | `/bookings/:id` | Elimina la reserva |

### Crear reserva

```http
POST /bookings
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "eventId": "uuid-del-evento",
  "notes": "Comentario opcional"
}
```

Errores frecuentes:
- `404` si el evento no existe.
- `409` si el usuario ya tiene una reserva para ese evento.

### Listar mis reservas

```http
GET /bookings
Authorization: Bearer <jwt>
```

Devuelve un arreglo con el booking y un resumen del evento:

```json
[
  {
    "id": 1,
    "status": "confirmed",
    "notes": "Primera fila",
    "event": {
      "id": "...",
      "title": "Conferencia de Node.js"
    }
  }
]
```

### Actualizar / cancelar

```http
PATCH /bookings/1
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "status": "cancelled",
  "notes": "No podré asistir"
}
```

Se valida que seas el propietario (`ForbiddenException` en caso contrario).

## Tips para extenderlo

- Agrega un `@IsEnum(BookingStatus)` en el DTO para validar estados personalizados.
- Usa el patrón mostrado aquí para crear tus propios módulos relacionados (ej: `tickets`, `payments`).
- Aprovecha el hook `BookingService.ensureOwnership` (si lo renombras) para centralizar permisos y reusarlo en controladores.
- Puedes publicar eventos de dominio (Nest EventEmitter) cuando un booking pase de `pending` a `confirmed` para enviar correos.

Con estas piezas tienes un flujo completo: autentícate → crea eventos → reserva. Experimenta cambiando la lógica antes de construir tu solución final.

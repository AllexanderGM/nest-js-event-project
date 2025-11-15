import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventService } from './event.service';
import { Event } from './entities/event.entity';
import { User } from '../user/entities/user.entity';
import {
  multerConfig,
  validateFilesCount,
  validateFilesSize,
} from '../common/utils/file-upload.config';

/**
 * Controlador de Eventos
 *
 * Maneja todas las peticiones HTTP relacionadas con eventos.
 * Define los endpoints REST y delega la lógica al EventService.
 *
 * Ruta base: /events
 *
 * Endpoints disponibles:
 * - POST   /events          -> Crear evento
 * - GET    /events          -> Listar todos los eventos
 * - GET    /events/:id      -> Obtener un evento específico
 * - PATCH  /events/:id      -> Actualizar evento
 * - DELETE /events/:id      -> Eliminar evento
 */
@Controller('events')
export class EventController {
  /**
   * Constructor del controlador
   * @param eventService - Servicio de eventos inyectado automáticamente
   */
  constructor(private readonly eventService: EventService) {}

  /**
   * Crea un nuevo evento con imágenes opcionales
   *
   * @param createEventDto - Datos del evento desde el body de la petición
   * @param files - Array de archivos de imagen (máximo 5)
   * @returns El evento creado con su ID generado
   *
   * Endpoint: POST /events
   * Status: 201 Created
   * Content-Type: multipart/form-data
   *
   * Ejemplo de petición (multipart/form-data):
   * POST /events
   * - title: "Conferencia Tech"
   * - date: "2025-01-15T10:00:00Z"
   * - description: "Evento sobre tecnología"
   * - location: "Auditorio Principal"
   * - images: [archivo1.jpg, archivo2.png] (opcional, máx. 5 imágenes de 5MB c/u)
   *
   * Formatos permitidos: jpg, jpeg, png, gif, webp
   */
  @Post()
  @UseInterceptors(FilesInterceptor('images', 5, multerConfig))
  async create(
    @Body() createEventDto: CreateEventDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<Event> {
    // Validar archivos si fueron enviados
    if (files && files.length > 0) {
      validateFilesCount(files);
      validateFilesSize(files);
    }

    return this.eventService.create(createEventDto, files);
  }

  /**
   * Obtiene todos los eventos
   *
   * @returns Array con todos los eventos de la base de datos
   *
   * Endpoint: GET /events
   * Status: 200 OK
   *
   * Ejemplo de respuesta:
   * [
   *   {
   *     "id": "uuid-1",
   *     "title": "Conferencia Tech",
   *     "date": "2025-01-15T10:00:00Z",
   *     "description": "Evento sobre tecnología",
   *     "location": "Auditorio Principal",
   *     "createdAt": "2025-01-01T12:00:00Z",
   *     "updatedAt": "2025-01-01T12:00:00Z"
   *   }
   * ]
   */
  @Get()
  findAll(): Promise<Event[]> {
    return this.eventService.findAll();
  }

  /**
   * Obtiene un evento específico por su ID
   *
   * @param id - ID del evento (UUID) desde la URL
   * @returns El evento encontrado
   *
   * Endpoint: GET /events/:id
   * Status: 200 OK (si existe) o 404 Not Found (si no existe)
   *
   * Ejemplo: GET /events/a1b2c3d4-e5f6-7890-abcd-ef1234567890
   */
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Event> {
    return this.eventService.findOne(id);
  }

  /**
   * Actualiza un evento existente
   *
   * @param id - ID del evento desde la URL
   * @param updateEventDto - Campos a actualizar desde el body
   * @returns El evento actualizado
   *
   * Endpoint: PATCH /events/:id
   * Status: 200 OK (si existe) o 404 Not Found (si no existe)
   *
   * Ejemplo de petición:
   * PATCH /events/a1b2c3d4-e5f6-7890-abcd-ef1234567890
   * {
   *   "title": "Nuevo título",
   *   "location": "Nueva ubicación"
   * }
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    return this.eventService.update(id, updateEventDto);
  }

  /**
   * Elimina un evento
   *
   * @param id - ID del evento desde la URL
   * @returns Void (sin contenido)
   *
   * Endpoint: DELETE /events/:id
   * Status: 204 No Content (si existe) o 404 Not Found (si no existe)
   *
   * Ejemplo: DELETE /events/a1b2c3d4-e5f6-7890-abcd-ef1234567890
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Retorna código 204 (sin contenido)
  remove(@Param('id') id: string): Promise<void> {
    return this.eventService.remove(id);
  }

  // ==========================================
  // GESTIÓN DE RELACIONES (Many-to-Many)
  // ==========================================

  /**
   * Registra un usuario a un evento
   *
   * Asocia un usuario con un evento en la relación Many-to-Many.
   * Crea un registro en la tabla intermedia event_attendees.
   *
   * @param eventId - ID del evento (UUID) desde la URL
   * @param userId - ID del usuario (número) desde la URL
   * @returns El evento actualizado con la lista de asistentes
   *
   * Endpoint: POST /events/:eventId/register/:userId
   * Status: 200 OK (si todo va bien)
   * Status: 404 Not Found (si el evento o usuario no existe)
   * Status: 400 Bad Request (si el usuario ya está registrado)
   *
   * Ejemplos:
   * POST /events/a1b2c3d4-e5f6-7890-abcd-ef1234567890/register/1
   * POST /events/uuid-123/register/5
   *
   * Respuesta:
   * {
   *   "id": "uuid-123",
   *   "title": "Conferencia Tech",
   *   "attendees": [
   *     { "id": 1, "displayName": "Juan Pérez" },
   *     { "id": 5, "displayName": "María García" }
   *   ],
   *   ...
   * }
   *
   * TABLA INTERMEDIA event_attendees:
   * event_id              | user_id
   * ----------------------+---------
   * uuid-123              | 1
   * uuid-123              | 5
   */
  @Post(':eventId/register/:userId')
  registerUser(
    @Param('eventId') eventId: string,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Event> {
    return this.eventService.registerUserToEvent(eventId, userId);
  }

  /**
   * Quita un usuario de un evento
   *
   * Desasocia un usuario de un evento en la relación Many-to-Many.
   * Elimina el registro en la tabla intermedia event_attendees.
   *
   * @param eventId - ID del evento (UUID) desde la URL
   * @param userId - ID del usuario (número) desde la URL
   * @returns El evento actualizado sin ese usuario en los asistentes
   *
   * Endpoint: DELETE /events/:eventId/unregister/:userId
   * Status: 200 OK (si todo va bien)
   * Status: 404 Not Found (si el evento no existe)
   * Status: 400 Bad Request (si el usuario no estaba registrado)
   *
   * Ejemplos:
   * DELETE /events/a1b2c3d4-e5f6-7890-abcd-ef1234567890/unregister/1
   * DELETE /events/uuid-123/unregister/5
   *
   * Respuesta:
   * {
   *   "id": "uuid-123",
   *   "title": "Conferencia Tech",
   *   "attendees": [
   *     // Usuario con id 1 ya no está en la lista
   *   ],
   *   ...
   * }
   */
  @Delete(':eventId/unregister/:userId')
  unregisterUser(
    @Param('eventId') eventId: string,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Event> {
    return this.eventService.unregisterUserFromEvent(eventId, userId);
  }

  /**
   * Obtiene todos los usuarios registrados a un evento
   *
   * Lista los asistentes (attendees) de un evento específico.
   *
   * @param eventId - ID del evento (UUID) desde la URL
   * @returns Array de usuarios registrados al evento
   *
   * Endpoint: GET /events/:eventId/attendees
   * Status: 200 OK (si el evento existe)
   * Status: 404 Not Found (si el evento no existe)
   *
   * Ejemplos:
   * GET /events/a1b2c3d4-e5f6-7890-abcd-ef1234567890/attendees
   * GET /events/uuid-123/attendees
   *
   * Respuesta:
   * [
   *   {
   *     "id": 1,
   *     "displayName": "Juan Pérez",
   *     "avatarUrl": "https://example.com/avatar.jpg",
   *     "originWorld": "Earth",
   *     "isAlive": true,
   *     "createdAt": "2025-11-08T10:00:00.000Z",
   *     "updatedAt": "2025-11-08T10:00:00.000Z"
   *   },
   *   {
   *     "id": 5,
   *     "displayName": "María García",
   *     ...
   *   }
   * ]
   */
  @Get(':eventId/attendees')
  getAttendees(@Param('eventId') eventId: string): Promise<User[]> {
    return this.eventService.getEventAttendees(eventId);
  }
}

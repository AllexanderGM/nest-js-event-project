import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventService } from './event.service';
import { Event } from './entities/event.entity';

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
   * Crea un nuevo evento
   *
   * @param createEventDto - Datos del evento desde el body de la petición
   * @returns El evento creado con su ID generado
   *
   * Endpoint: POST /events
   * Status: 201 Created
   *
   * Ejemplo de petición:
   * POST /events
   * {
   *   "title": "Conferencia Tech",
   *   "date": "2025-01-15T10:00:00Z",
   *   "description": "Evento sobre tecnología",
   *   "location": "Auditorio Principal"
   * }
   */
  @Post()
  create(@Body() createEventDto: CreateEventDto): Promise<Event> {
    return this.eventService.create(createEventDto);
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
}

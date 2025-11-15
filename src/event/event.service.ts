import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { User } from '../user/entities/user.entity';

/**
 * Servicio de Eventos
 *
 * Contiene la lógica de negocio para la gestión de eventos.
 * Se encarga de las operaciones CRUD (Create, Read, Update, Delete)
 * interactuando con la base de datos a través de TypeORM.
 */
@Injectable()
export class EventService {
  /**
   * Constructor del servicio
   * @param repository - Repositorio de Event inyectado automáticamente
   * @param userRepository - Repositorio de User inyectado automáticamente
   */
  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Crea un nuevo evento en la base de datos con imágenes opcionales
   *
   * @param createEventDto - Datos del evento a crear
   * @param files - Array de archivos de imagen (opcional)
   * @returns El evento creado con su ID generado
   *
   * Ejemplo:
   * const evento = await eventService.create({
   *   title: "Conferencia",
   *   date: "2025-01-15T10:00:00Z"
   * }, files);
   */
  async create(
    createEventDto: CreateEventDto,
    files?: Express.Multer.File[],
  ): Promise<Event> {
    // Procesa las rutas de las imágenes si fueron enviadas
    let imagePaths: string[] | undefined = undefined;
    if (files && files.length > 0) {
      // Guarda solo las rutas relativas para acceso público
      // Ejemplo: uploads/events/uuid-timestamp.jpg
      imagePaths = files.map((file) => `uploads/events/${file.filename}`);
    }

    // Crea una instancia del evento con los datos del DTO
    const newEvent = this.repository.create({
      ...createEventDto,
      date: new Date(createEventDto.date), // Convierte el string a Date
      images: imagePaths, // Guarda las rutas o undefined
    });

    // Guarda el evento en la base de datos
    return this.repository.save(newEvent);
  }

  /**
   * Obtiene todos los eventos de la base de datos
   *
   * @returns Array con todos los eventos
   */
  async findAll(): Promise<Event[]> {
    return this.repository.find();
  }

  /**
   * Busca un evento específico por su ID
   *
   * @param id - ID único del evento (UUID)
   * @returns El evento encontrado
   * @throws NotFoundException si el evento no existe
   */
  async findOne(id: string): Promise<Event> {
    const event = await this.repository.findOne({ where: { id } });

    if (!event) {
      throw new NotFoundException(`Event with id ${id} was not found`);
    }

    return event;
  }

  /**
   * Actualiza un evento existente
   *
   * @param id - ID del evento a actualizar
   * @param updateEventDto - Campos a actualizar (pueden ser parciales)
   * @returns El evento actualizado
   * @throws NotFoundException si el evento no existe
   */
  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    // Verifica que el evento exista
    const existingEvent = await this.findOne(id);

    // Actualiza los campos básicos (title, description, location)
    if (updateEventDto.title !== undefined) {
      existingEvent.title = updateEventDto.title;
    }
    if (updateEventDto.description !== undefined) {
      existingEvent.description = updateEventDto.description;
    }
    if (updateEventDto.location !== undefined) {
      existingEvent.location = updateEventDto.location;
    }

    // Si se envía una fecha, la convierte a Date y actualiza
    if (updateEventDto.date) {
      existingEvent.date = new Date(updateEventDto.date);
    }

    // Guarda los cambios en la base de datos
    return this.repository.save(existingEvent);
  }

  /**
   * Elimina un evento de la base de datos
   *
   * @param id - ID del evento a eliminar
   * @throws NotFoundException si el evento no existe
   */
  async remove(id: string): Promise<void> {
    const result = await this.repository.delete(id);

    // Verifica si se eliminó algún registro
    if (result.affected === 0) {
      throw new NotFoundException(`Event with id ${id} was not found`);
    }
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
   * @param eventId - ID del evento (UUID)
   * @param userId - ID del usuario (número)
   * @returns El evento actualizado con sus asistentes
   * @throws NotFoundException si el evento o usuario no existe
   * @throws BadRequestException si el usuario ya está registrado
   *
   * EJEMPLO DE USO:
   * await eventService.registerUserToEvent('uuid-123', 1);
   *
   * TABLA INTERMEDIA:
   * event_attendees
   * ├── event_id = 'uuid-123'
   * └── user_id = 1
   *
   * Ejemplo de petición:
   * POST /events/uuid-123/register/1
   */
  async registerUserToEvent(eventId: string, userId: number): Promise<Event> {
    // 1. Cargar el evento con sus asistentes actuales
    const event = await this.repository.findOne({
      where: { id: eventId },
      relations: ['attendees'], // Carga la relación Many-to-Many
    });

    if (!event) {
      throw new NotFoundException(`Event with id ${eventId} was not found`);
    }

    // 2. Verificar que el usuario existe
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} was not found`);
    }

    // 3. Verificar si el usuario ya está registrado
    const isAlreadyRegistered = event.attendees.some(
      (attendee) => attendee.id === userId,
    );

    if (isAlreadyRegistered) {
      throw new BadRequestException(
        `User with id ${userId} is already registered to event ${eventId}`,
      );
    }

    // 4. Agregar el usuario a los asistentes
    event.attendees = [...event.attendees, user];

    // 5. Guardar el evento (actualiza automáticamente event_attendees)
    return this.repository.save(event);
  }

  /**
   * Quita un usuario de un evento
   *
   * Desasocia un usuario de un evento en la relación Many-to-Many.
   * Elimina el registro en la tabla intermedia event_attendees.
   *
   * @param eventId - ID del evento (UUID)
   * @param userId - ID del usuario (número)
   * @returns El evento actualizado sin ese usuario
   * @throws NotFoundException si el evento o usuario no existe
   * @throws BadRequestException si el usuario no está registrado
   *
   * EJEMPLO DE USO:
   * await eventService.unregisterUserFromEvent('uuid-123', 1);
   *
   * Ejemplo de petición:
   * DELETE /events/uuid-123/unregister/1
   */
  async unregisterUserFromEvent(
    eventId: string,
    userId: number,
  ): Promise<Event> {
    // 1. Cargar el evento con sus asistentes
    const event = await this.repository.findOne({
      where: { id: eventId },
      relations: ['attendees'],
    });

    if (!event) {
      throw new NotFoundException(`Event with id ${eventId} was not found`);
    }

    // 2. Verificar si el usuario está registrado
    const userIndex = event.attendees.findIndex(
      (attendee) => attendee.id === userId,
    );

    if (userIndex === -1) {
      throw new BadRequestException(
        `User with id ${userId} is not registered to event ${eventId}`,
      );
    }

    // 3. Quitar el usuario de los asistentes
    event.attendees = event.attendees.filter(
      (attendee) => attendee.id !== userId,
    );

    // 4. Guardar el evento (actualiza automáticamente event_attendees)
    return this.repository.save(event);
  }

  /**
   * Obtiene todos los asistentes de un evento
   *
   * @param eventId - ID del evento (UUID)
   * @returns Array de usuarios registrados al evento
   * @throws NotFoundException si el evento no existe
   *
   * EJEMPLO DE USO:
   * const attendees = await eventService.getEventAttendees('uuid-123');
   *
   * Ejemplo de petición:
   * GET /events/uuid-123/attendees
   */
  async getEventAttendees(eventId: string): Promise<User[]> {
    const event = await this.repository.findOne({
      where: { id: eventId },
      relations: ['attendees'],
    });

    if (!event) {
      throw new NotFoundException(`Event with id ${eventId} was not found`);
    }

    return event.attendees;
  }
}

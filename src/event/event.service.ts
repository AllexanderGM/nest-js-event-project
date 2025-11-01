import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';

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
   * @param repository - Repositorio de TypeORM inyectado automáticamente
   */
  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
  ) {}

  /**
   * Crea un nuevo evento en la base de datos
   *
   * @param createEventDto - Datos del evento a crear
   * @returns El evento creado con su ID generado
   *
   * Ejemplo:
   * const evento = await eventService.create({
   *   title: "Conferencia",
   *   date: "2025-01-15T10:00:00Z"
   * });
   */
  async create(createEventDto: CreateEventDto): Promise<Event> {
    // Crea una instancia del evento con los datos del DTO
    const newEvent = this.repository.create({
      ...createEventDto,
      date: new Date(createEventDto.date), // Convierte el string a Date
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
}

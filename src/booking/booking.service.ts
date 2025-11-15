import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';
import { Event } from '../event/entities/event.entity';
import { User } from '../user/entities/user.entity';

/**
 * Servicio de gestión de reservas
 *
 * Maneja toda la lógica de negocio relacionada con las reservas de eventos
 */
@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,

    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Crea una nueva reserva para un evento
   *
   * @param createBookingDto - Datos de la reserva
   * @param userId - ID del usuario autenticado (obtenido del token JWT)
   * @returns Reserva creada con las relaciones de user y event
   */
  async create(
    createBookingDto: CreateBookingDto,
    userId: number,
  ): Promise<Booking> {
    const { eventId, notes } = createBookingDto;

    // Verificar que el evento existe
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException(
        `El evento con ID ${eventId} no fue encontrado`,
      );
    }

    // Verificar que el usuario no tenga ya una reserva para este evento
    const existingBooking = await this.bookingRepository.findOne({
      where: {
        userId,
        eventId,
      },
    });

    if (existingBooking) {
      throw new ConflictException(
        'Ya tienes una reserva para este evento. Puedes modificar tu reserva existente.',
      );
    }

    // Crear la nueva reserva
    const booking = this.bookingRepository.create({
      userId,
      eventId,
      notes,
    });

    const savedBooking = await this.bookingRepository.save(booking);

    // Retornar la reserva con las relaciones cargadas
    const result = await this.bookingRepository.findOne({
      where: { id: savedBooking.id },
      relations: ['user', 'event'],
    });

    if (!result) {
      throw new NotFoundException('Error al crear la reserva');
    }

    return result;
  }

  /**
   * Obtiene todas las reservas del usuario autenticado
   *
   * @param userId - ID del usuario autenticado
   * @returns Lista de reservas del usuario con información del evento
   */
  async findAllByUser(userId: number): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { userId },
      relations: ['event'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Obtiene todas las reservas (solo para administradores)
   *
   * @returns Lista de todas las reservas con información de usuario y evento
   */
  async findAll(): Promise<Booking[]> {
    return this.bookingRepository.find({
      relations: ['user', 'event'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Obtiene una reserva por su ID
   *
   * @param id - ID de la reserva
   * @param userId - ID del usuario autenticado
   * @returns Reserva encontrada con las relaciones
   */
  async findOne(id: number, userId: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['user', 'event'],
    });

    if (!booking) {
      throw new NotFoundException(`La reserva con ID ${id} no fue encontrada`);
    }

    // Verificar que la reserva pertenece al usuario
    if (booking.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para ver esta reserva');
    }

    return booking;
  }

  /**
   * Actualiza una reserva existente
   *
   * @param id - ID de la reserva
   * @param updateBookingDto - Datos a actualizar
   * @param userId - ID del usuario autenticado
   * @returns Reserva actualizada
   */
  async update(
    id: number,
    updateBookingDto: UpdateBookingDto,
    userId: number,
  ): Promise<Booking> {
    // Buscar la reserva
    const booking = await this.bookingRepository.findOne({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException(`La reserva con ID ${id} no fue encontrada`);
    }

    // Verificar que la reserva pertenece al usuario
    if (booking.userId !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para modificar esta reserva',
      );
    }

    // Actualizar los campos
    Object.assign(booking, updateBookingDto);

    await this.bookingRepository.save(booking);

    // Retornar la reserva actualizada con las relaciones
    const result = await this.bookingRepository.findOne({
      where: { id },
      relations: ['user', 'event'],
    });

    if (!result) {
      throw new NotFoundException('Error al actualizar la reserva');
    }

    return result;
  }

  /**
   * Elimina una reserva
   *
   * @param id - ID de la reserva
   * @param userId - ID del usuario autenticado
   */
  async remove(id: number, userId: number): Promise<void> {
    // Buscar la reserva
    const booking = await this.bookingRepository.findOne({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException(`La reserva con ID ${id} no fue encontrada`);
    }

    // Verificar que la reserva pertenece al usuario
    if (booking.userId !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para eliminar esta reserva',
      );
    }

    await this.bookingRepository.remove(booking);
  }

  /**
   * Obtiene todas las reservas de un evento específico
   *
   * @param eventId - ID del evento (UUID)
   * @returns Lista de reservas del evento
   */
  async findByEvent(eventId: string): Promise<Booking[]> {
    // Verificar que el evento existe
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException(
        `El evento con ID ${eventId} no fue encontrado`,
      );
    }

    return this.bookingRepository.find({
      where: { eventId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }
}

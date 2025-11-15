import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Event } from '../../event/entities/event.entity';

/**
 * Estados posibles de una reserva
 */
export enum BookingStatus {
  PENDING = 'pending', // Reserva pendiente de confirmación
  CONFIRMED = 'confirmed', // Reserva confirmada
  CANCELLED = 'cancelled', // Reserva cancelada
}

/**
 * Entidad Booking - Representa una reserva de evento
 *
 * Esta entidad gestiona las reservas que los usuarios hacen para los eventos.
 * Establece la relación Many-to-One con User y Event.
 *
 * RELACIONES:
 * - Many-to-One con User: Muchas reservas pueden pertenecer a un usuario
 * - Many-to-One con Event: Muchas reservas pueden ser para un mismo evento
 */
@Entity('bookings')
export class Booking {
  /**
   * ID único de la reserva
   * Se genera automáticamente de forma incremental
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * ID del usuario que hace la reserva
   */
  @Column()
  userId: number;

  /**
   * ID del evento reservado (UUID)
   */
  @Column()
  eventId: string;

  /**
   * Estado de la reserva
   * Puede ser: pending, confirmed, cancelled
   */
  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  /**
   * Notas adicionales de la reserva (opcional)
   */
  @Column({ nullable: true, type: 'text' })
  notes: string;

  /**
   * Fecha de creación de la reserva
   * Se genera automáticamente
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Fecha de última actualización
   * Se actualiza automáticamente
   */
  @UpdateDateColumn()
  updatedAt: Date;

  // ==========================================
  // RELACIONES (Relationships)
  // ==========================================

  /**
   * Usuario que realizó la reserva
   *
   * Relación Many-to-One con User:
   * - Muchas reservas pueden pertenecer a un usuario
   * - Un usuario puede tener muchas reservas
   *
   * EJEMPLO DE USO:
   * const booking = await bookingRepository.findOne({
   *   where: { id: 1 },
   *   relations: ['user']
   * });
   * console.log(booking.user.email);
   */
  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  /**
   * Evento reservado
   *
   * Relación Many-to-One con Event:
   * - Muchas reservas pueden ser para un mismo evento
   * - Un evento puede tener muchas reservas
   *
   * EJEMPLO DE USO:
   * const booking = await bookingRepository.findOne({
   *   where: { id: 1 },
   *   relations: ['event']
   * });
   * console.log(booking.event.title);
   */
  @ManyToOne(() => Event, { eager: false })
  @JoinColumn({ name: 'eventId' })
  event: Event;
}

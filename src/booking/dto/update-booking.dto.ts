import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BookingStatus } from '../entities/booking.entity';

/**
 * DTO para actualizar una reserva existente
 *
 * Permite actualizar el estado y las notas de la reserva
 */
export class UpdateBookingDto {
  /**
   * Estado de la reserva
   * Puede ser: pending, confirmed, cancelled
   */
  @IsEnum(BookingStatus, {
    message: 'El estado debe ser: pending, confirmed o cancelled',
  })
  @IsOptional()
  status?: BookingStatus;

  /**
   * Notas adicionales de la reserva
   */
  @IsString({ message: 'Las notas deben ser un texto' })
  @IsOptional()
  notes?: string;
}

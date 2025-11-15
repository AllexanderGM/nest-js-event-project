import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

/**
 * DTO para crear una nueva reserva
 *
 * El userId se obtiene automáticamente del token JWT,
 * por lo que no es necesario enviarlo en el body
 */
export class CreateBookingDto {
  /**
   * ID del evento a reservar (UUID)
   */
  @IsUUID('4', { message: 'El eventId debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El eventId es requerido' })
  eventId: string;

  /**
   * Notas adicionales para la reserva (opcional)
   */
  @IsString({ message: 'Las notas deben ser un texto' })
  @IsOptional()
  notes?: string;
}

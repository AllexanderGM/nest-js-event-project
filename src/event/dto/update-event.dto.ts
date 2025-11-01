import { IsString, IsOptional, IsDateString, MaxLength } from 'class-validator';

/**
 * DTO para actualizar un evento existente
 *
 * Este DTO permite actualizar parcialmente un evento.
 * Todos los campos son opcionales, lo que permite actualizar
 * solo los campos que se deseen modificar.
 *
 * Ejemplo de uso en una petición PATCH/PUT:
 * {
 *   "title": "Nuevo título del evento"
 * }
 *
 * O actualizar varios campos a la vez:
 * {
 *   "title": "Nuevo título",
 *   "date": "2025-02-20T15:00:00Z",
 *   "location": "Nueva ubicación"
 * }
 */
export class UpdateEventDto {
  /**
   * Título del evento
   * - Campo opcional
   * - Si se envía, debe ser un string
   * - Máximo 200 caracteres
   */
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  /**
   * Descripción del evento
   * - Campo opcional
   * - Si se envía, debe ser un string
   */
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * Fecha y hora del evento
   * - Campo opcional
   * - Si se envía, debe ser una fecha válida en formato ISO 8601
   */
  @IsOptional()
  @IsDateString()
  date?: string;

  /**
   * Ubicación del evento
   * - Campo opcional
   * - Si se envía, debe ser un string
   */
  @IsOptional()
  @IsString()
  location?: string;
}

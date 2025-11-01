import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  MaxLength,
} from 'class-validator';

/**
 * DTO para crear un nuevo evento
 *
 * Los DTOs (Data Transfer Objects) definen la estructura de datos
 * que debe enviarse en las peticiones HTTP. Este DTO incluye validaciones
 * automáticas usando class-validator.
 *
 * Ejemplo de uso en una petición POST:
 * {
 *   "title": "Conferencia de NestJS",
 *   "description": "Aprende a usar NestJS con TypeORM",
 *   "date": "2025-01-15T10:00:00Z",
 *   "location": "Auditorio Principal"
 * }
 */
export class CreateEventDto {
  /**
   * Título del evento
   * - Debe ser un string (texto)
   * - No puede estar vacío
   * - Máximo 200 caracteres
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  /**
   * Descripción del evento
   * - Debe ser un string (texto)
   * - Campo opcional
   */
  @IsString()
  @IsOptional()
  description?: string;

  /**
   * Fecha y hora del evento
   * - Debe ser una fecha válida en formato ISO 8601
   * - Ejemplo: "2025-01-15T10:00:00Z"
   * - No puede estar vacío
   */
  @IsDateString()
  @IsNotEmpty()
  date: string;

  /**
   * Ubicación del evento
   * - Debe ser un string (texto)
   * - Campo opcional
   */
  @IsString()
  @IsOptional()
  location?: string;
}

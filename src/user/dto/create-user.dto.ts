import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  MaxLength,
} from 'class-validator';

/**
 * DTO para crear un nuevo usuario
 *
 * Define la estructura de datos necesaria para crear un usuario.
 * Incluye validaciones automáticas con class-validator.
 *
 * Ejemplo de uso en una petición POST:
 * {
 *   "displayName": "Rick Sanchez",
 *   "avatarUrl": "https://example.com/avatar.jpg",
 *   "originWorld": "C-137",
 *   "isAlive": true
 * }
 */
export class CreateUserDto {
  /**
   * Nombre para mostrar del usuario
   * - Debe ser un string (texto)
   * - No puede estar vacío
   * - Máximo 100 caracteres
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  displayName: string;

  /**
   * URL del avatar del usuario
   * - Debe ser un string (texto)
   * - Campo opcional
   */
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  /**
   * Mundo de origen del usuario
   * - Debe ser un string (texto)
   * - Campo opcional
   */
  @IsString()
  @IsOptional()
  originWorld?: string;

  /**
   * Estado del usuario (vivo/muerto)
   * - Debe ser un booleano (true/false)
   * - Campo opcional (por defecto: true)
   */
  @IsBoolean()
  @IsOptional()
  isAlive?: boolean;
}

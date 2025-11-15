import {
  IsString,
  IsOptional,
  IsBoolean,
  MaxLength,
  IsUrl,
} from 'class-validator';

/**
 * DTO para actualizar un usuario existente
 *
 * Permite actualizar parcialmente los datos de un usuario.
 * Todos los campos son opcionales.
 *
 * Ejemplo de uso en una petición PATCH/PUT:
 * {
 *   "displayName": "Morty Smith",
 *   "isAlive": false
 * }
 */
export class UpdateUserDto {
  /**
   * Nombre para mostrar del usuario
   * - Campo opcional
   * - Si se envía, debe ser un string
   * - Máximo 100 caracteres
   */
  @IsString()
  @IsOptional()
  @MaxLength(100)
  displayName?: string;

  /**
   * URL del avatar del usuario
   * - Campo opcional
   * - Si se envía, debe ser una URL válida
   */
  @IsUrl()
  @IsOptional()
  avatarUrl?: string;

  /**
   * Mundo de origen del usuario
   * - Campo opcional
   * - Si se envía, debe ser un string
   */
  @IsString()
  @IsOptional()
  originWorld?: string;

  /**
   * Estado del usuario (vivo/muerto)
   * - Campo opcional
   * - Si se envía, debe ser un booleano (true/false)
   */
  @IsBoolean()
  @IsOptional()
  isAlive?: boolean;
}

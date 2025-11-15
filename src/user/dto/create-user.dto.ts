import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  MaxLength,
  IsUrl,
} from 'class-validator';

/**
 * DTO para crear un nuevo usuario
 *
 * Define la estructura y validaciones para crear usuarios en la base de datos.
 *
 * CAMBIO IMPORTANTE:
 * Anteriormente: User Service consumía API externa (Rick and Morty)
 * Ahora: User Service usa TypeORM y base de datos local MySQL
 *
 * Ejemplo de uso en una petición POST:
 * POST /users
 * {
 *   "displayName": "Juan Pérez",
 *   "avatarUrl": "https://example.com/avatar.jpg",
 *   "originWorld": "Earth",
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
   * - Debe ser una URL válida
   * - Campo opcional
   */
  @IsUrl()
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

  // ==========================================
  // NOTA SOBRE RELACIONES:
  // ==========================================
  // Los eventos a los que el usuario está registrado NO se crean aquí.
  // Las relaciones se gestionan mediante endpoints específicos:
  //
  // POST /events/:eventId/register/:userId - Registrar usuario a evento
  // DELETE /events/:eventId/unregister/:userId - Quitar usuario de evento
  //
  // Ver más en: src/event/event.controller.ts
  // ==========================================
}

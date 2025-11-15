import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  MaxLength,
} from 'class-validator';

/**
 * DTO para el registro de nuevos usuarios
 */
export class RegisterDto {
  /**
   * Email del usuario (debe ser único)
   */
  @IsEmail({}, { message: 'El email debe ser válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;

  /**
   * Contraseña del usuario
   */
  @IsString({ message: 'La contraseña debe ser un texto' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  /**
   * Nombre para mostrar del usuario
   */
  @IsString({ message: 'El displayName debe ser un texto' })
  @IsNotEmpty({ message: 'El displayName es requerido' })
  @MaxLength(100, {
    message: 'El displayName no puede tener más de 100 caracteres',
  })
  displayName: string;

  /**
   * URL del avatar (opcional)
   */
  @IsString({ message: 'El avatarUrl debe ser un texto' })
  @IsOptional()
  avatarUrl?: string;

  /**
   * Mundo de origen (opcional)
   */
  @IsString({ message: 'El originWorld debe ser un texto' })
  @IsOptional()
  originWorld?: string;
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../user/entities/user.entity';

/**
 * Payload del JWT
 * Información que se almacena dentro del token
 */
export interface JwtPayload {
  sub: number; // ID del usuario
  email: string; // Email del usuario
  displayName: string; // Nombre para mostrar del usuario
}

/**
 * Estrategia JWT para validar tokens
 *
 * Esta estrategia se ejecuta automáticamente cuando se usa el JwtAuthGuard.
 * Valida el token y retorna el usuario autenticado.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    configService: ConfigService,
  ) {
    super({
      // Extrae el token del header Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // No ignora tokens expirados
      ignoreExpiration: false,

      // Secret para validar la firma del token
      secretOrKey: configService.get<string>('JWT_SECRET', 'your-secret-key'),
    });
  }

  /**
   * Valida el payload del JWT
   *
   * Este método se ejecuta DESPUÉS de que Passport valida la firma del token.
   * Aquí podemos hacer validaciones adicionales (ej: verificar que el usuario existe).
   *
   * @param payload - Payload decodificado del JWT
   * @returns Usuario autenticado
   */
  async validate(payload: JwtPayload): Promise<User> {
    const { sub: userId } = payload;

    // Busca el usuario en la base de datos
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    // Si el usuario no existe, lanza una excepción
    if (!user) {
      throw new UnauthorizedException('Token inválido');
    }

    // Retorna el usuario (se adjunta a request.user automáticamente)
    return user;
  }
}

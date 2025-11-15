import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * Guard JWT que protege las rutas
 *
 * Este guard se ejecuta antes de cada request y valida que:
 * 1. El token JWT sea válido
 * 2. El usuario exista en la base de datos
 *
 * Si la ruta tiene el decorador @Public(), se saltea la validación.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * Determina si se puede activar el guard
   *
   * @param context - Contexto de ejecución
   * @returns true si la ruta es pública o el token es válido
   */
  canActivate(context: ExecutionContext) {
    // Verifica si la ruta tiene el decorador @Public()
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si es pública, permite el acceso sin validar token
    if (isPublic) {
      return true;
    }

    // Si no es pública, ejecuta la validación JWT normal
    return super.canActivate(context);
  }
}

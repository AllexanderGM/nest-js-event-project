import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../user/entities/user.entity';

/**
 * Decorador para obtener el usuario autenticado
 *
 * Extrae el usuario del request después de que el JwtAuthGuard lo valida.
 *
 * EJEMPLO:
 * ```typescript
 * @Get('profile')
 * getProfile(@GetUser() user: User) {
 *   return user; // Usuario autenticado
 * }
 * ```
 */
export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as User;
  },
);

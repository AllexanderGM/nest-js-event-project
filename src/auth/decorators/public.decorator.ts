import { SetMetadata } from '@nestjs/common';

/**
 * Clave para identificar rutas públicas
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Decorador para marcar rutas como públicas
 *
 * Las rutas marcadas con @Public() no requieren autenticación.
 *
 * EJEMPLO:
 * ```typescript
 * @Public()
 * @Post('login')
 * async login(@Body() loginDto: LoginDto) {
 *   return this.authService.login(loginDto);
 * }
 * ```
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

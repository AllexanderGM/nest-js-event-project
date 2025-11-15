import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Public } from './decorators/public.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';

/**
 * Controlador de autenticación
 *
 * Maneja los endpoints de login, register y perfil de usuario
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint de registro
   *
   * Crea un nuevo usuario y retorna un token JWT
   *
   * @route POST /auth/register
   * @access Public
   */
  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * Endpoint de login
   *
   * Valida credenciales y retorna un token JWT
   *
   * @route POST /auth/login
   * @access Public
   */
  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * Endpoint de perfil
   *
   * Retorna los datos del usuario autenticado
   *
   * @route GET /auth/profile
   * @access Private (requiere token JWT)
   */
  @Get('profile')
  getProfile(@GetUser() user: User) {
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      originWorld: user.originWorld,
      isAlive: user.isAlive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

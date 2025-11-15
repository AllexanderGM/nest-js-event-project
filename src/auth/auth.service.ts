import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './strategies/jwt.strategy';

/**
 * Servicio de autenticación
 *
 * Maneja el registro, login y generación de tokens JWT
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registra un nuevo usuario
   *
   * @param registerDto - Datos del nuevo usuario
   * @returns Token JWT y datos del usuario
   */
  async register(registerDto: RegisterDto) {
    const { email, password, displayName, avatarUrl, originWorld } =
      registerDto;

    // Verifica si el email ya está registrado
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Hashea la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea el nuevo usuario
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      displayName,
      avatarUrl,
      originWorld,
      isAlive: true,
    });

    // Guarda el usuario en la base de datos
    await this.userRepository.save(user);

    // Genera el token JWT
    const token = this.generateToken(user);

    // Retorna el token y los datos del usuario (sin la contraseña)
    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        originWorld: user.originWorld,
        isAlive: user.isAlive,
      },
    };
  }

  /**
   * Inicia sesión de un usuario
   *
   * @param loginDto - Credenciales del usuario
   * @returns Token JWT y datos del usuario
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Busca el usuario por email (incluye el password con select)
    const user = await this.userRepository.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'password',
        'displayName',
        'avatarUrl',
        'originWorld',
        'isAlive',
      ],
    });

    // Verifica que el usuario existe
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verifica que la contraseña sea correcta
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Genera el token JWT
    const token = this.generateToken(user);

    // Retorna el token y los datos del usuario (sin la contraseña)
    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        originWorld: user.originWorld,
        isAlive: user.isAlive,
      },
    };
  }

  /**
   * Genera un token JWT para el usuario
   *
   * @param user - Usuario autenticado
   * @returns Token JWT
   */
  private generateToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      displayName: user.displayName,
    };

    return this.jwtService.sign(payload);
  }

  /**
   * Valida un usuario por su ID
   *
   * @param userId - ID del usuario
   * @returns Usuario encontrado
   */
  async validateUser(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return user;
  }
}

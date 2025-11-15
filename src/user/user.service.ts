import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * Servicio de Usuarios
 *
 * Gestiona la lógica de negocio para operaciones CRUD de usuarios.
 * Utiliza TypeORM para interactuar con la base de datos MySQL.
 *
 * CAMBIO IMPORTANTE:
 * Anteriormente: Consultaba la API externa de Rick and Morty
 * Ahora: Gestiona usuarios en la base de datos local con TypeORM
 *
 * Funcionalidades:
 * - CRUD completo de usuarios
 * - Validación de existencia
 * - Manejo de relaciones con eventos (Many-to-Many)
 */
@Injectable()
export class UserService {
  /**
   * Constructor del servicio
   * @param repository - Repositorio de TypeORM inyectado automáticamente
   */
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  /**
   * Crea un nuevo usuario en la base de datos
   *
   * @param createUserDto - Datos del usuario a crear
   * @returns El usuario creado con su ID generado
   *
   * Ejemplo:
   * const user = await userService.create({
   *   displayName: "Juan Pérez",
   *   avatarUrl: "https://example.com/avatar.jpg",
   *   originWorld: "Earth",
   *   isAlive: true
   * });
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Crea una instancia del usuario con los datos del DTO
    const newUser = this.repository.create(createUserDto);

    // Guarda el usuario en la base de datos
    return this.repository.save(newUser);
  }

  /**
   * Obtiene todos los usuarios de la base de datos
   *
   * @param includeEvents - Si debe cargar los eventos relacionados (opcional)
   * @returns Array con todos los usuarios
   *
   * Ejemplo:
   * const users = await userService.findAll();
   * const usersWithEvents = await userService.findAll(true);
   */
  async findAll(includeEvents = false): Promise<User[]> {
    if (includeEvents) {
      // Carga usuarios con sus eventos relacionados
      return this.repository.find({ relations: ['events'] });
    }
    return this.repository.find();
  }

  /**
   * Busca un usuario específico por su ID
   *
   * @param id - ID único del usuario
   * @param includeEvents - Si debe cargar los eventos relacionados (opcional)
   * @returns El usuario encontrado
   * @throws NotFoundException si el usuario no existe
   *
   * Ejemplo:
   * const user = await userService.findOne(1);
   * const userWithEvents = await userService.findOne(1, true);
   */
  async findOne(id: number, includeEvents = false): Promise<User> {
    const relations = includeEvents ? ['events'] : [];

    const user = await this.repository.findOne({
      where: { id },
      relations,
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} was not found`);
    }

    return user;
  }

  /**
   * Actualiza un usuario existente
   *
   * @param id - ID del usuario a actualizar
   * @param updateUserDto - Campos a actualizar (pueden ser parciales)
   * @returns El usuario actualizado
   * @throws NotFoundException si el usuario no existe
   *
   * Ejemplo:
   * const updatedUser = await userService.update(1, {
   *   displayName: "Juan Pérez Actualizado",
   *   isAlive: false
   * });
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    // Verifica que el usuario exista
    const existingUser = await this.findOne(id);

    // Actualiza los campos proporcionados
    Object.assign(existingUser, updateUserDto);

    // Guarda los cambios en la base de datos
    return this.repository.save(existingUser);
  }

  /**
   * Elimina un usuario de la base de datos
   *
   * @param id - ID del usuario a eliminar
   * @throws NotFoundException si el usuario no existe
   *
   * IMPORTANTE: Al eliminar un usuario, también se eliminan sus registros
   * en la tabla intermedia event_attendees (usuarios registrados a eventos)
   * debido a las configuraciones de CASCADE en la base de datos.
   *
   * Ejemplo:
   * await userService.remove(1);
   */
  async remove(id: number): Promise<void> {
    const result = await this.repository.delete(id);

    // Verifica si se eliminó algún registro
    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} was not found`);
    }
  }
}

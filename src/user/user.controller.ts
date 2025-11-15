import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

/**
 * Controlador de Usuarios
 *
 * Maneja todas las peticiones HTTP relacionadas con usuarios.
 * Define los endpoints REST y delega la lógica al UserService.
 *
 * CAMBIO IMPORTANTE:
 * Anteriormente: Solo tenía GET /users/:id que consultaba la API de Rick and Morty
 * Ahora: CRUD completo con base de datos local
 *
 * Ruta base: /users
 *
 * Endpoints disponibles:
 * - POST   /users                    -> Crear usuario
 * - GET    /users                    -> Listar todos los usuarios
 * - GET    /users/:id                -> Obtener un usuario específico
 * - PATCH  /users/:id                -> Actualizar usuario
 * - DELETE /users/:id                -> Eliminar usuario
 *
 * Query Parameters:
 * - includeEvents: Incluye los eventos relacionados en las respuestas
 */
@Controller('users')
export class UserController {
  /**
   * Constructor del controlador
   * @param userService - Servicio de usuarios inyectado automáticamente
   */
  constructor(private readonly userService: UserService) {}

  /**
   * Crea un nuevo usuario
   *
   * @param createUserDto - Datos del usuario desde el body de la petición
   * @returns El usuario creado con su ID generado
   *
   * Endpoint: POST /users
   * Status: 201 Created
   *
   * Ejemplo de petición:
   * POST /users
   * {
   *   "displayName": "Juan Pérez",
   *   "avatarUrl": "https://example.com/avatar.jpg",
   *   "originWorld": "Earth",
   *   "isAlive": true
   * }
   */
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  /**
   * Obtiene todos los usuarios
   *
   * @param includeEvents - Si debe incluir los eventos relacionados (query param opcional)
   * @returns Array con todos los usuarios de la base de datos
   *
   * Endpoint: GET /users
   * Status: 200 OK
   *
   * Ejemplos:
   * GET /users                    -> Usuarios sin eventos
   * GET /users?includeEvents=true -> Usuarios con eventos a los que están registrados
   *
   * Respuesta con includeEvents=true:
   * [
   *   {
   *     "id": 1,
   *     "displayName": "Juan Pérez",
   *     "events": [
   *       { "id": "uuid-123", "title": "Conferencia Tech" }
   *     ]
   *   }
   * ]
   */
  @Get()
  findAll(@Query('includeEvents') includeEvents?: string): Promise<User[]> {
    // Convierte el query param string a boolean
    const includeEventsBoolean = includeEvents === 'true';
    return this.userService.findAll(includeEventsBoolean);
  }

  /**
   * Obtiene un usuario específico por su ID
   *
   * @param id - ID del usuario (número) desde la URL
   * @param includeEvents - Si debe incluir los eventos relacionados (query param opcional)
   * @returns El usuario encontrado
   *
   * Endpoint: GET /users/:id
   * Status: 200 OK (si existe) o 404 Not Found (si no existe)
   *
   * Ejemplos:
   * GET /users/1                    -> Usuario sin eventos
   * GET /users/1?includeEvents=true -> Usuario con sus eventos
   *
   * Respuesta:
   * {
   *   "id": 1,
   *   "displayName": "Juan Pérez",
   *   "avatarUrl": "https://example.com/avatar.jpg",
   *   "originWorld": "Earth",
   *   "isAlive": true,
   *   "createdAt": "2025-11-08T10:00:00.000Z",
   *   "updatedAt": "2025-11-08T10:00:00.000Z"
   * }
   */
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('includeEvents') includeEvents?: string,
  ): Promise<User> {
    const includeEventsBoolean = includeEvents === 'true';
    return this.userService.findOne(id, includeEventsBoolean);
  }

  /**
   * Actualiza un usuario existente
   *
   * @param id - ID del usuario desde la URL
   * @param updateUserDto - Campos a actualizar desde el body
   * @returns El usuario actualizado
   *
   * Endpoint: PATCH /users/:id
   * Status: 200 OK (si existe) o 404 Not Found (si no existe)
   *
   * Ejemplo de petición:
   * PATCH /users/1
   * {
   *   "displayName": "Juan Pérez Actualizado",
   *   "isAlive": false
   * }
   *
   * Nota: Solo envía los campos que quieres actualizar.
   * Los campos no enviados mantendrán su valor actual.
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  /**
   * Elimina un usuario
   *
   * @param id - ID del usuario desde la URL
   * @returns Void (sin contenido)
   *
   * Endpoint: DELETE /users/:id
   * Status: 204 No Content (si existe) o 404 Not Found (si no existe)
   *
   * Ejemplo: DELETE /users/1
   *
   * IMPORTANTE: Al eliminar un usuario, también se eliminan sus registros
   * en la tabla intermedia event_attendees (usuarios registrados a eventos).
   * Sin embargo, los eventos en sí NO se eliminan.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Retorna código 204 (sin contenido)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.userService.remove(id);
  }
}

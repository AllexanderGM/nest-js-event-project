import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserMapper } from './mappers/user.mapper';
import { UserResponse } from './user-response.interface';

/**
 * Servicio de Usuarios
 *
 * Este servicio obtiene información de usuarios desde la API pública
 * de Rick and Morty. Es un ejemplo de integración con APIs externas.
 *
 * Nota: Este servicio NO interactúa con la base de datos local,
 * solo consulta la API externa.
 */
@Injectable()
export class UserService {
  /** URL base de la API de Rick and Morty */
  private readonly baseUrl = 'https://rickandmortyapi.com/api/character';

  /**
   * Obtiene la información de un usuario desde la API de Rick and Morty
   *
   * @param id - ID del personaje en la API de Rick and Morty
   * @returns Información del usuario transformada a nuestro formato
   * @throws Error si la API no responde correctamente
   *
   * Ejemplo:
   * const user = await userService.getUser(1);
   * // Retorna información de Rick Sanchez
   */
  async getUser(id: number): Promise<UserDto> {
    // Realiza petición GET a la API externa
    const apiResponse = await fetch(`${this.baseUrl}/${id}`);

    // Verifica si la respuesta fue exitosa
    if (!apiResponse.ok) {
      throw new Error(`Rick & Morty API returned ${apiResponse.status}`);
    }

    // Convierte la respuesta a JSON
    const data = (await apiResponse.json()) as UserResponse;

    // Transforma los datos de la API a nuestro formato usando el mapper
    return UserMapper.fromApiResponse(data);
  }
}

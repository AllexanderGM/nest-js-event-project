import { UserResponse } from '../user-response.interface';
import { UserDto } from '../dto/user.dto';

export class UserMapper {
  static fromApiResponse(response: UserResponse): UserDto {
    return new UserDto(
      response.id,
      response.name,
      response.image,
      response.origin.name,
      response.status.toLowerCase() === 'alive',
    );
  }
}

import { CreateUserDto } from "../../dto/user/create-user.dto";
import { UserResponseDto } from "../../dto/user/user-response.dto";
import { User } from "../../entities/user";

export class UserMapper {
  static toEntity(dto: CreateUserDto): User {
    const user = new User();

    user.firstName = dto.firstName;
    user.lastName = dto.lastName;
    user.email = dto.email;
    user.createdAt = new Date();
    user.passwordHash = "mock hashed password";

    return user;
  }

  static toResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}
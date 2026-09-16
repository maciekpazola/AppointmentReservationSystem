import bcrypt from "bcrypt";
import { CreateUserDto } from "../../dto/user/create-user.dto";
import { UserResponseDto } from "../../dto/user/user-response.dto";
import { User } from "../../entities/user";

export class UserMapper {
  static async toEntity(dto: CreateUserDto): Promise<User> {
    const user = new User();

    user.firstName = dto.firstName;
    user.lastName = dto.lastName;
    user.email = dto.email;
    user.createdAt = new Date();
    user.passwordHash = await bcrypt.hash(dto.password, 10);

    return user;
  }

  static toResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}
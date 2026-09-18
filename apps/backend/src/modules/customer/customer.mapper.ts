import bcrypt from "bcrypt";
import { CreateCustomerDto } from "../../dto/customer/create-customer.dto";
import { CustomerResponseDto } from "../../dto/customer/customer-response.dto";
import { User } from "../../entities/user";
import { UserRole } from "../../enums/userRole";

export class CustomerMapper {
  static async toEntity(dto: CreateCustomerDto): Promise<User> {
    const customer = new User();

    customer.firstName = dto.firstName;
    customer.lastName = dto.lastName;
    customer.email = dto.email;
    customer.role = UserRole.CUSTOMER;
    customer.createdAt = new Date();
    customer.passwordHash = await bcrypt.hash(dto.password, 10);

    return customer;
  }

  static toResponse(user: User): CustomerResponseDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}

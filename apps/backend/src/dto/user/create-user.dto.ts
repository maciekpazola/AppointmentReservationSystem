import {
    IsString,
    IsEmail,
    MinLength,
    IsNotEmpty,
} from "class-validator";

export class CreateUserDto {

  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @MinLength(6)
  @IsNotEmpty()
  password!: string;
}
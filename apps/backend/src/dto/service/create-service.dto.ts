import {
    IsString,
    IsNotEmpty,
    IsNumber,
} from "class-validator";

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
    
  @IsNumber()
  @IsNotEmpty()
  price!: number;
}

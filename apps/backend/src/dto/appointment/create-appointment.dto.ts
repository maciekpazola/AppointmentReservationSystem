import {
    IsInt,
    IsPositive,
    IsNotEmpty,
    IsDate
} from "class-validator";

import { Type } from "class-transformer";

export class CreateAppointmentDto {
  @Type(() => Date)
  @IsDate()
  startTime!: Date;

  @Type(() => Date)
  @IsDate()
  endTime!: Date;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  customerId!: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  employeeId!: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  serviceId!: number;
}

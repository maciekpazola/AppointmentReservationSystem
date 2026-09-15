import {
    IsInt,
    IsPositive,
    IsNotEmpty,
    IsDateString,
    Matches
} from "class-validator";

export class CreateEmployeeScheduleDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  employeeId!: number;

  @IsDateString()
  date!: string;

  @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, {
      message: "startTime must be in HH:mm or HH:mm:ss format"
  })
  startTime!: string;

  @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, {
      message: "endTime must be in HH:mm or HH:mm:ss format"
  })
  endTime!: string;
}

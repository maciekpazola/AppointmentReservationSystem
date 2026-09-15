export class AvailabilityResponseDto {

    employeeId!: number;

    date!: string;

    slots!: AvailabilitySlotDto[];
}


export class AvailabilitySlotDto {

    startTime!: Date;

    endTime!: Date;
}
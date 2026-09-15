import { AvailabilityResponseDto, AvailabilitySlotDto } from "../../dto/employee/availability-response.dto";
import { Appointment } from "../../entities/appointment";
import { EmployeeSchedule } from "../../entities/employeeSchedule";
import { AppointmentStatus } from "../../enums/appointmentStatus";
import { Repository, LessThan, MoreThan, Not } from "typeorm";
import { startOfDay, endOfDay, format } from "date-fns";


export class AvailabilityService {

    constructor(
        private appointmentRepository: Repository<Appointment>,
        private employeeRepository: Repository<EmployeeSchedule>
    ) {}

    async ensureAvailable(
        employeeId: number,
        startTime: Date,
        endTime: Date
    ): Promise<void> {

        const conflict =
            await this.appointmentRepository.findOne({
                where: {
                    employeeId,
                    status: Not(AppointmentStatus.CANCELLED),
                    startTime: LessThan(endTime),
                    endTime: MoreThan(startTime)
                }
            });

        if(conflict){
            throw new Error(
                "Employee is busy."
            );
        }
    }

    async getAvailability(
        employeeId: number,
        date: Date
    ): Promise<AvailabilityResponseDto> {

        const employeeSchedule =
            await this.employeeRepository.findOne({
                where: {
                    employeeId,
                    date: format(date, "yyyy-MM-dd")
                }
            });

        if (!employeeSchedule) {
            return {
                employeeId,
                date: date.toISOString(),
                slots: []
            };
        }

        const appointments =
            await this.appointmentRepository.find({
                where: {
                    employeeId,
                    startTime: LessThan(endOfDay(date)),
                    endTime: MoreThan(startOfDay(date))
                }
            });


        const slots =
            this.calculateAvailableSlots(
                date,
                employeeSchedule,
                appointments
            );


        return {
            employeeId,
            date: date.toISOString(),
            slots
        };
    }

    private calculateAvailableSlots(
        date: Date,
        employeeSchedule: EmployeeSchedule,
        appointments: Appointment[]
    ): AvailabilitySlotDto[] {

        const slots: AvailabilitySlotDto[] = [];

        const slotDuration = 60;


        let currentSlotStart =
            this.combineDateAndTime(date, employeeSchedule.startTime!);


        const workEnd =
            this.combineDateAndTime(date, employeeSchedule.endTime!);


        while (currentSlotStart < workEnd) {

            const currentSlotEnd =
                new Date(currentSlotStart);


            currentSlotEnd.setMinutes(
                currentSlotEnd.getMinutes() + slotDuration
            );


            if (currentSlotEnd > workEnd) {
                break;
            }


            const isOccupied =
                appointments.some(appointment =>
                    appointment.startTime < currentSlotEnd &&
                    appointment.endTime > currentSlotStart
                );


            if (!isOccupied) {

                slots.push({
                    startTime: new Date(currentSlotStart),
                    endTime: new Date(currentSlotEnd)
                });
            }


            currentSlotStart.setMinutes(
                currentSlotStart.getMinutes() + slotDuration
            );
        }


        return slots;
    }

    private combineDateAndTime(date: Date, time: string): Date {

        const [hours, minutes, seconds] = time.split(":").map(Number);

        const combined = new Date(date);
        combined.setHours(hours, minutes, seconds ?? 0, 0);

        return combined;
    }
}
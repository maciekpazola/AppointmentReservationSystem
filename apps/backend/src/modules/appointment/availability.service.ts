import { Appointment } from "../../entities/appointment";
import { AppointmentStatus } from "../../enums/appointmentStatus";
import { Repository, LessThan, MoreThan, Not } from "typeorm";


export class AvailabilityService {

    constructor(
        private appointmentRepository: Repository<Appointment>
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
        console.log("StartTime:", startTime);
        console.log("EndTime:", endTime);
        console.log("Conflict found:", conflict);
        if(conflict){
            throw new Error(
                "Employee is busy."
            );
        }
    }
}
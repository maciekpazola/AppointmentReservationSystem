import { Appointment } from "../../entities/appointment";
import { Repository, LessThan, MoreThan } from "typeorm";


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
}
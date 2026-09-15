import { CreateAppointmentDto } from "../../dto/appointment/create-appointment.dto";
import { AppointmentMapper } from "./appointment.mapper";
import { Appointment } from "../../entities/appointment";
import { AvailabilityService } from "../availability/availability.service";
import { Repository } from "typeorm";

export class AppointmentService {

        constructor(
        private appointmentRepository: Repository<Appointment>,
        private availabilityService: AvailabilityService
    ) {}


    async getAppointments() {

        const appointments = await this.appointmentRepository.find();
        const response = appointments.map(AppointmentMapper.toResponse);
        return response;
    }


    async getAppointmentById(id: number) {
        const appointment = await this.appointmentRepository.findOne({
            where: {
                id
            }
        });
        if (!appointment) {
            return null;
        }

        return appointment;
    }


    async createAppointment(dto: CreateAppointmentDto) {

        if (dto.startTime >= dto.endTime) {
            throw new Error("Invalid time range");
        }

        await this.availabilityService.ensureAvailable(
            dto.employeeId,
            dto.startTime,
            dto.endTime
        );

        const entity = AppointmentMapper.toEntity(dto);

        const appointment =
            this.appointmentRepository.create(entity);

        return this.appointmentRepository.save(appointment);
    }
}
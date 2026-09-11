import { AppDataSource } from "../../config/database";
import { CreateAppointmentDto } from "../../dto/appointment/create-appointment.dto";
import { AppointmentMapper } from "./appointment.mapper";
import { Appointment } from "../../entities/appointment";


export class AppointmentService {

    private appointmentRepository =
        AppDataSource.getRepository(Appointment);


    async getAppointments() {

        const appointments = await this.appointmentRepository.find();
        const response = appointments.map(AppointmentMapper.toResponse);
        return response;
    }


    async getAppointmentById(id: number) {
        return this.appointmentRepository.findOne({
            where: {
                id
            }
        });
    }


    async createAppointment(dto: CreateAppointmentDto) {

        const entity = AppointmentMapper.toEntity(dto);
        const appointment = this.appointmentRepository.create(entity);

        return this.appointmentRepository.save(appointment);
    }
}
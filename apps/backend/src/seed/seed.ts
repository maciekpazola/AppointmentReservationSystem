import { AppDataSource } from "../config/database";
import { User } from "../entities/user";
import { Service } from "../entities/service";
import { EmployeeSchedule } from "../entities/employeeSchedule";
import { UserRole } from "../enums/userRole";
import { format, isWeekend } from "date-fns";


async function seed() {

    await AppDataSource.initialize();


    const userRepository =
        AppDataSource.getRepository(User);

    const serviceRepository =
        AppDataSource.getRepository(Service);

    const employeeScheduleRepository =
        AppDataSource.getRepository(EmployeeSchedule);



    /*
        USERS
    */

    const users = [
        {
            email: "admin@test.com",
            passwordHash: "hashed_password",
            firstName: "Admin",
            lastName: "System",
            role: UserRole.ADMIN
        },
        {
            email: "anna.employee@test.com",
            passwordHash: "hashed_password",
            firstName: "Anna",
            lastName: "Kowalska",
            role: UserRole.EMPLOYEE
        },
        {
            email: "piotr.employee@test.com",
            passwordHash: "hashed_password",
            firstName: "Piotr",
            lastName: "Nowak",
            role: UserRole.EMPLOYEE
        },
        {
            email: "jan.customer@test.com",
            passwordHash: "hashed_password",
            firstName: "Jan",
            lastName: "Kowalski",
            role: UserRole.CUSTOMER
        },
        {
            email: "kasia.customer@test.com",
            passwordHash: "hashed_password",
            firstName: "Katarzyna",
            lastName: "Wiśniewska",
            role: UserRole.CUSTOMER
        }
    ];


    for (const userData of users) {

        const exists =
            await userRepository.findOne({
                where: {
                    email: userData.email
                }
            });


        if (!exists) {

            const user =
                userRepository.create(userData);

            await userRepository.save(user);

            console.log(
                `Created user: ${user.email}`
            );
        }
    }



    /*
        SERVICES
    */

    const services = [
        {
            name: "Massage",
            price: 150
        },
        {
            name: "Haircut",
            price: 80
        },
        {
            name: "Facial Treatment",
            price: 200
        },
        {
            name: "Physiotherapy",
            price: 180
        },
        {
            name: "Consultation",
            price: 100
        }
    ];


    for (const serviceData of services) {

        const exists =
            await serviceRepository.findOne({
                where: {
                    name: serviceData.name
                }
            });


        if (!exists) {

            const service =
                serviceRepository.create(serviceData);

            await serviceRepository.save(service);

            console.log(
                `Created service: ${service.name}`
            );
        }
    }



    /*
        EMPLOYEE SCHEDULES
    */

    const employees = [
        "anna.employee@test.com",
        "piotr.employee@test.com"
    ];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // next 14 calendar days, weekdays only
    const workingDates: string[] = [];

    for (let dayOffset = 1; dayOffset <= 14; dayOffset++) {

        const day = new Date(today);
        day.setDate(day.getDate() + dayOffset);

        if (!isWeekend(day)) {
            workingDates.push(format(day, "yyyy-MM-dd"));
        }
    }

    for (const email of employees) {

        const employee =
            await userRepository.findOne({
                where: {
                    email
                }
            });

        if (!employee) {
            continue;
        }

        for (const date of workingDates) {

            const exists =
                await employeeScheduleRepository.findOne({
                    where: {
                        employeeId: employee.id,
                        date
                    }
                });

            if (!exists) {

                const schedule =
                    employeeScheduleRepository.create({
                        employeeId: employee.id,
                        date,
                        startTime: "09:00:00",
                        endTime: "17:00:00"
                    });

                await employeeScheduleRepository.save(schedule);

                console.log(
                    `Created schedule for ${employee.email}: ${date}`
                );
            }
        }
    }



    await AppDataSource.destroy();
}


seed()
    .catch((error) => {

        console.error(error);

        process.exit(1);
    });
import { AppDataSource } from "../config/database";
import { User } from "../entities/user";


async function seed() {

    await AppDataSource.initialize();


    const userRepository =
        AppDataSource.getRepository(User);


    const existingUser =
        await userRepository.findOne({
            where: {
                email: "admin@test.com"
            }
        });


    if (!existingUser) {

        const user = userRepository.create({
            firstName: "Admin",
            lastName: "User",
            email: "admin@test.com",
            passwordHash: "hashed_password",
            createdAt: new Date()
        });


        await userRepository.save(user);

        console.log("Admin user created");

    } else {

        console.log("Admin user already exists");

    }


    await AppDataSource.destroy();
}


seed()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
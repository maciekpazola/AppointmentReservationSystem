import { AppDataSource } from "../config/database";
import { User } from "../entities/User";


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
            email: "admin@test.com",
            passwordHash: "hashed_password"
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
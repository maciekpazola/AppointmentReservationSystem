import { AppDataSource } from "../config/database";
import { User } from "../entities/User";


export class UserService {

    private userRepository =
        AppDataSource.getRepository(User);


    async getUsers() {
        return this.userRepository.find();
    }


    async getUserById(id: number) {
        return this.userRepository.findOne({
            where: {
                id
            }
        });
    }


    async createUser(data: Partial<User>) {

        const user = this.userRepository.create(data);

        return this.userRepository.save(user);
    }
}
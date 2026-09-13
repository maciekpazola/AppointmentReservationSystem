import { CreateUserDto } from "../../dto/user/create-user.dto";
import { UserMapper } from "./user.mapper";
import { User } from "../../entities/user";
import { Repository } from "typeorm";

export class UserService {

    constructor(
        private userRepository: Repository<User>
    ) {}


    async getUsers() {

        const users = await this.userRepository.find();
        const response = users.map(UserMapper.toResponse);
        return response;
    }


    async getUserById(id: number) {
        return this.userRepository.findOne({
            where: {
                id
            }
        });
    }


    async createUser(dto: CreateUserDto) {

        const entity = UserMapper.toEntity(dto);
        const user = this.userRepository.create(entity);

        return this.userRepository.save(user);
    }
}
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
        const user = await this.userRepository.findOne({
            where: {
                id
            }
        });

        if (!user) {
            return null;
        }
        const response = UserMapper.toResponse(user);
        return response;
    }

    
    async createUser(dto: CreateUserDto) {

        const entity = await UserMapper.toEntity(dto);
        const user = this.userRepository.create(entity);
        await this.userRepository.save(user);
        return UserMapper.toResponse(user);
    }
}
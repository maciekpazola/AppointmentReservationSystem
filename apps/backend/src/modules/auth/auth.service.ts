import bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { User } from "../../entities/user";
import { LoginDto } from "../../dto/auth/login.dto";
import { LoginResponseDto } from "../../dto/auth/login-response.dto";
import { JwtService } from "../../auth/jwt.service";

export class AuthService {

    constructor(
        private userRepository: Repository<User>,
        private jwtService: JwtService
    ) {}

    async login(dto: LoginDto): Promise<LoginResponseDto> {

        const user = await this.userRepository.findOne({
            where: {
                email: dto.email
            }
        });

        if (!user) {
            throw new Error("Invalid credentials");
        }

        const passwordMatches =
            await bcrypt.compare(dto.password, user.passwordHash);

        if (!passwordMatches) {
            throw new Error("Invalid credentials");
        }

        const accessToken = this.jwtService.generate({
            id: user.id,
            role: user.role
        });

        return {
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        };
    }
}

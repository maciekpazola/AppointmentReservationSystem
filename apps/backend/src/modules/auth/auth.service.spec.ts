import bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { AuthService } from "./auth.service";
import { JwtService } from "../../auth/jwt.service";
import { User } from "../../entities/user";
import { LoginDto } from "../../dto/auth/login.dto";
import { UserRole } from "../../enums/userRole";

jest.mock("bcrypt");

describe("AuthService", () => {
  let userRepository: jest.Mocked<Repository<User>>;
  let jwtService: jest.Mocked<JwtService>;
  let authService: AuthService;

  const user: User = {
    id: 1,
    email: "john@example.com",
    passwordHash: "hashed",
    firstName: "John",
    lastName: "Doe",
    role: UserRole.CUSTOMER,
    createdAt: new Date("2024-01-01"),
  } as User;

  const dto: LoginDto = {
    email: "john@example.com",
    password: "password123",
  };

  beforeEach(() => {
    userRepository = {
      findOne: jest.fn(),
    } as unknown as jest.Mocked<Repository<User>>;

    jwtService = {
      generate: jest.fn(),
      verify: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    authService = new AuthService(userRepository, jwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe("login", () => {
    it("returns access token and user when credentials are valid", async () => {
      userRepository.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.generate.mockReturnValue("signed-token");

      const result = await authService.login(dto);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: dto.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        dto.password,
        user.passwordHash
      );
      expect(jwtService.generate).toHaveBeenCalledWith({
        id: user.id,
        role: user.role,
      });
      expect(result).toEqual({
        accessToken: "signed-token",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      });
    });

    it("throws when user is not found", async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(authService.login(dto))
        .rejects
        .toThrow("Invalid credentials");

      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwtService.generate).not.toHaveBeenCalled();
    });

    it("throws when password does not match", async () => {
      userRepository.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(dto))
        .rejects
        .toThrow("Invalid credentials");

      expect(jwtService.generate).not.toHaveBeenCalled();
    });

    it("propagates repository errors", async () => {
      userRepository.findOne.mockRejectedValue(new Error("Database error"));

      await expect(authService.login(dto))
        .rejects
        .toThrow("Database error");
    });
  });
});

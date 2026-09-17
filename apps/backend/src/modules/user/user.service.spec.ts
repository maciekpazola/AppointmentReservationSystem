import { Repository } from "typeorm";
import { UserService } from "./user.service";
import { UserMapper } from "./user.mapper";
import { User } from "../../entities/user";
import { CreateUserDto } from "../../dto/user/create-user.dto";
import { UserResponseDto } from "../../dto/user/user-response.dto";
import { UserRole } from "../../enums/userRole";

describe("UserService", () => {
  let userRepository: jest.Mocked<Repository<User>>;
  let userService: UserService;

  const user: User = {
    id: 1,
    email: "john@example.com",
    passwordHash: "hashed",
    firstName: "John",
    lastName: "Doe",
    role: UserRole.CUSTOMER,
    createdAt: new Date("2024-01-01"),
  } as User;

  const userResponse: UserResponseDto = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    email: user.email,
    createdAt: user.createdAt,
  };

  const createRepositoryMock = (): jest.Mocked<Repository<User>> =>
    ({
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<Repository<User>>);

  beforeEach(() => {
    userRepository = createRepositoryMock();
    userService = new UserService(userRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe("getUsers", () => {
    it("returns mapped users from repository", async () => {
      userRepository.find.mockResolvedValue([user]);

      const result = await userService.getUsers();

      expect(userRepository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual([userResponse]);
    });

    it("returns empty array when repository has no users", async () => {
      userRepository.find.mockResolvedValue([]);

      const result = await userService.getUsers();

      expect(userRepository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });

    it("propagates repository errors", async () => {
      userRepository.find.mockRejectedValue(
        new Error("Database error")
      );

      await expect(userService.getUsers())
        .rejects
        .toThrow("Database error");
    });
  });

  describe("getUserById", () => {
    it("returns mapped user when repository finds user", async () => {
      userRepository.findOne.mockResolvedValue(user);

      const result = await userService.getUserById(1);

      expect(userRepository.findOne)
        .toHaveBeenCalledWith({
          where: { id: 1 },
        });

      expect(result).toEqual(userResponse);
    });

    it("returns null when repository finds no user", async () => {
      userRepository.findOne.mockResolvedValue(null);

      const result = await userService.getUserById(999);

      expect(userRepository.findOne)
        .toHaveBeenCalledWith({
          where: { id: 999 },
        });

      expect(result).toBeNull();
    });

    it("propagates repository errors", async () => {
      userRepository.findOne.mockRejectedValue(
        new Error("Database error")
      );

      await expect(userService.getUserById(1))
        .rejects
        .toThrow("Database error");
    });
  });

  describe("createUser", () => {
    const dto: CreateUserDto = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "password123",
    };

    it("maps dto, creates entity and saves user", async () => {
      jest
        .spyOn(UserMapper, "toEntity")
        .mockResolvedValue(user);

      userRepository.create.mockReturnValue(user);
      userRepository.save.mockResolvedValue(user);

      const result = await userService.createUser(dto);

      expect(UserMapper.toEntity)
        .toHaveBeenCalledWith(dto);

      expect(userRepository.create)
        .toHaveBeenCalledWith(user);

      expect(userRepository.save)
        .toHaveBeenCalledWith(user);

      expect(result)
        .toEqual(userResponse);
    });

    it("propagates error when mapping dto to entity fails", async () => {
      jest
        .spyOn(UserMapper, "toEntity")
        .mockRejectedValue(new Error("Hashing failed"));

      await expect(userService.createUser(dto))
        .rejects
        .toThrow("Hashing failed");

      expect(userRepository.create).not.toHaveBeenCalled();
      expect(userRepository.save).not.toHaveBeenCalled();
    });

    it("propagates error when saving user fails", async () => {
      jest
        .spyOn(UserMapper, "toEntity")
        .mockResolvedValue(user);

      userRepository.create.mockReturnValue(user);

      userRepository.save.mockRejectedValue(
        new Error("Save failed")
      );

      await expect(userService.createUser(dto))
        .rejects
        .toThrow("Save failed");
    });
  });
});
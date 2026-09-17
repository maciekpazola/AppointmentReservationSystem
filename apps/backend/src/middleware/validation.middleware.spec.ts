import { Request, Response, NextFunction } from "express";
import { validateDto } from "./validation.middleware";
import { CreateUserDto } from "../dto/user/create-user.dto";

const mockResponse = (): jest.Mocked<Response> => {
  const res = {} as jest.Mocked<Response>;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const makeRequest = (body: unknown): Request =>
  ({ method: "POST", path: "/users", body }) as unknown as Request;

const validBody = {
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  password: "password123",
};

type FieldError = { field: string };

const failedFields = (res: jest.Mocked<Response>): string[] => {
  const payload = res.json.mock.calls[0][0] as { errors: FieldError[] };
  return payload.errors.map((error) => error.field).sort();
};

describe("validation.middleware", () => {
  let res: jest.Mocked<Response>;
  let next: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    res = mockResponse();
    next = jest.fn();
  });

  describe("factory guards", () => {
    it.each([
      ["undefined", undefined],
      ["null", null],
    ])("throws synchronously when dtoClass is %s", (_label, dtoClass) => {
      expect(() =>
        validateDto(dtoClass as unknown as typeof CreateUserDto),
      ).toThrow("DTO class is missing in validateDto()");
    });

    it("does not throw when given a real DTO class", () => {
      expect(() => validateDto(CreateUserDto)).not.toThrow();
    });
  });

  describe("valid payloads", () => {
    it("replaces req.body with a DTO instance and calls next", async () => {
      const req = makeRequest({ ...validBody });

      await validateDto(CreateUserDto)(req, res, next);

      expect(req.body).toBeInstanceOf(CreateUserDto);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("preserves every submitted value on the DTO instance", async () => {
      const req = makeRequest({ ...validBody });

      await validateDto(CreateUserDto)(req, res, next);

      expect(req.body).toMatchObject(validBody);
    });

    it("does not strip properties that are not declared on the DTO", async () => {
      // plainToInstance only strips extraneous props with excludeExtraneousValues + @Expose(),
      // which CreateUserDto does not use, so unknown fields pass through untouched.
      const req = makeRequest({
        ...validBody,
        role: "ADMIN",
        isVerified: true,
      });

      await validateDto(CreateUserDto)(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(req.body).toHaveProperty("role", "ADMIN");
      expect(req.body).toHaveProperty("isVerified", true);
    });
  });

  describe("invalid payloads", () => {
    it("returns 400 and reports exactly the fields that failed", async () => {
      const req = makeRequest({
        firstName: "",
        lastName: "Doe",
        email: "not-an-email",
        password: "123",
      });

      await validateDto(CreateUserDto)(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Validation failed" }),
      );
      expect(failedFields(res)).toEqual(["email", "firstName", "password"]);
      expect(next).not.toHaveBeenCalled();
    });

    it("attaches at least one human-readable constraint message per failed field", async () => {
      const req = makeRequest({ ...validBody, email: "not-an-email" });

      await validateDto(CreateUserDto)(req, res, next);

      const payload = res.json.mock.calls[0][0] as {
        errors: Array<{ field: string; constraints: Record<string, string> }>;
      };
      expect(payload.errors).toHaveLength(1);
      const messages = Object.values(payload.errors[0].constraints);
      expect(messages.length).toBeGreaterThan(0);
      expect(messages[0]).toEqual(expect.any(String));
    });

    it.each([
      ["an empty object", {}],
      ["null", null],
      ["undefined", undefined],
      ["a string", "firstName=John"],
      ["an array", [validBody]],
    ])("returns 400 when the body is %s", async (_label, body) => {
      const req = makeRequest(body);

      await validateDto(CreateUserDto)(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });

    it("leaves req.body untouched when validation fails", async () => {
      const body = { ...validBody, email: "not-an-email" };
      const req = makeRequest(body);

      await validateDto(CreateUserDto)(req, res, next);

      expect(req.body).toBe(body);
    });
  });
});

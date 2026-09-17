import { Request, Response, NextFunction } from "express";
import { authenticate, authorize } from "./auth.middleware";
import { JwtService } from "../auth/jwt.service";
import { UserRole } from "../enums/userRole";

const mockResponse = (): jest.Mocked<Response> => {
  const res = {} as jest.Mocked<Response>;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("auth.middleware", () => {
  let req: Partial<Request>;
  let res: jest.Mocked<Response>;
  let next: jest.MockedFunction<NextFunction>;
  let verifySpy: jest.SpiedFunction<JwtService["verify"]>;

  beforeEach(() => {
    req = { headers: {} };
    res = mockResponse();
    next = jest.fn();
    verifySpy = jest.spyOn(JwtService.prototype, "verify");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("authenticate", () => {
    describe("rejects malformed authorization headers", () => {
      const cases: Array<[string, string | undefined]> = [
        ["header is missing", undefined],
        ["scheme is not Bearer", "Basic abc123"],
        ["scheme is present but token is missing", "Bearer"],
        ["token is an empty string", "Bearer "],
        ["scheme casing is wrong", "bearer valid-token"],
      ];

      it.each(cases)("returns 401 when %s", (_label, authorization) => {
        req.headers = authorization === undefined ? {} : { authorization };

        authenticate(req as Request, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
          message: "Missing or invalid authorization header",
        });
        expect(next).not.toHaveBeenCalled();
      });

      it.each(cases)(
        "never reaches token verification when %s",
        (_label, authorization) => {
          req.headers = authorization === undefined ? {} : { authorization };

          authenticate(req as Request, res, next);

          expect(verifySpy).not.toHaveBeenCalled();
        },
      );
    });

    it("attaches decoded payload to req.user and calls next when token is valid", () => {
      const payload = { id: 1, role: UserRole.CUSTOMER };
      verifySpy.mockReturnValue(payload);
      req.headers = { authorization: "Bearer valid-token" };

      authenticate(req as Request, res, next);

      expect(verifySpy).toHaveBeenCalledTimes(1);
      expect(verifySpy).toHaveBeenCalledWith("valid-token");
      expect(req.user).toEqual(payload);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("returns 401 when token verification throws", () => {
      verifySpy.mockImplementation(() => {
        throw new Error("jwt expired");
      });
      req.headers = { authorization: "Bearer expired-token" };

      authenticate(req as Request, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid or expired token",
      });
      expect(req.user).toBeUndefined();
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("authorize", () => {
    it("returns 401 when there is no authenticated user", () => {
      const middleware = authorize(UserRole.EMPLOYEE);

      middleware(req as Request, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Not authenticated" });
      expect(next).not.toHaveBeenCalled();
    });

    it("denies every authenticated user when no roles are configured", () => {
      req.user = { id: 1, role: UserRole.ADMIN };
      const middleware = authorize();

      middleware(req as Request, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "Forbidden" });
      expect(next).not.toHaveBeenCalled();
    });

    describe.each([
      [UserRole.EMPLOYEE, true],
      [UserRole.ADMIN, true],
      [UserRole.CUSTOMER, false],
    ])("with allowed roles EMPLOYEE and ADMIN, role %s", (role, allowed) => {
      beforeEach(() => {
        req.user = { id: 1, role };
        authorize(UserRole.EMPLOYEE, UserRole.ADMIN)(req as Request, res, next);
      });

      if (allowed) {
        it("calls next without an error", () => {
          expect(next).toHaveBeenCalledTimes(1);
          expect(next).toHaveBeenCalledWith();
        });

        it("does not write a response", () => {
          expect(res.status).not.toHaveBeenCalled();
          expect(res.json).not.toHaveBeenCalled();
        });
      } else {
        it("returns 403 Forbidden", () => {
          expect(res.status).toHaveBeenCalledWith(403);
          expect(res.json).toHaveBeenCalledWith({ message: "Forbidden" });
        });

        it("does not call next", () => {
          expect(next).not.toHaveBeenCalled();
        });
      }
    });
  });
});

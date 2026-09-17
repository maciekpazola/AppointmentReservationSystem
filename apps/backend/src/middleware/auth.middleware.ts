import { Request, Response, NextFunction } from "express";
import { JwtService, JwtPayload } from "../auth/jwt.service";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

const jwtService = new JwtService();

export function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
) {

    const header = req.headers.authorization;


    if (!header || !header.startsWith("Bearer ")) {

        return res.status(401).json({
            message: "Missing or invalid authorization header"
        });
    }

    const token = header.substring("Bearer ".length);

    try {

        const payload = jwtService.verify(token);
        req.user = payload;

        next();

    } catch (error) {

        console.error("[AUTH] Token verification failed:", {
            error: error instanceof Error
                ? error.message
                : error
        });


        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}


export function authorize(...roles: string[]) {

    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {


        console.log("[AUTHORIZATION] Checking roles:", {
            requiredRoles: roles,
            user: req.user
        });


        if (!req.user) {

            console.warn("[AUTHORIZATION] No authenticated user");

            return res.status(401).json({
                message: "Not authenticated"
            });
        }


        if (!roles.includes(req.user.role)) {

            console.warn("[AUTHORIZATION] Forbidden role:", {
                userRole: req.user.role,
                allowedRoles: roles
            });

            return res.status(403).json({
                message: "Forbidden"
            });
        }


        console.log("[AUTHORIZATION] Access granted:", {
            userId: req.user.id,
            role: req.user.role
        });


        next();
    };
}
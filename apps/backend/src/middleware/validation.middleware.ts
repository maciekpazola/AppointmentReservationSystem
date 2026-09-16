import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";


function sanitizeBody(body: any) {

    if (!body) {
        return body;
    }

    const copy = { ...body };

    if (copy.password) {
        copy.password = "***";
    }

    return copy;
}


export function validateDto(dtoClass: any) {

    if (!dtoClass) {
        throw new Error("DTO class is missing in validateDto()");
    }


    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        console.log("[VALIDATION] Starting validation:", {
            method: req.method,
            path: req.path,
            dto: dtoClass.name,
            body: sanitizeBody(req.body)
        });


        const dtoInstance = plainToInstance(
            dtoClass,
            req.body
        );


        console.log("[VALIDATION] DTO instance created:", {
            instanceType: dtoInstance.constructor.name
        });


        const errors = await validate(dtoInstance);


        if (errors.length > 0) {

            console.warn("[VALIDATION] Failed:", {
                path: req.path,
                errors: errors.map(error => ({
                    field: error.property,
                    constraints: error.constraints
                }))
            });


            return res.status(400).json({
                message: "Validation failed",
                errors: errors.map(error => ({
                    field: error.property,
                    constraints: error.constraints
                }))
            });
        }


        console.log("[VALIDATION] Success:", {
            dto: dtoClass.name,
            path: req.path
        });


        req.body = dtoInstance;


        next();
    };
}
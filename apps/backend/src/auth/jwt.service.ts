import jwt from "jsonwebtoken";


export interface JwtPayload {
    id: number;
    role: string;
}


export class JwtService {

    private secret = process.env.JWT_SECRET!;


    generate(payload: JwtPayload) {

        return jwt.sign(
            payload,
            this.secret,
            {
                expiresIn: "15m"
            }
        );
    }


    verify(token: string) {

        return jwt.verify(
            token,
            this.secret
        ) as JwtPayload;

    }
}
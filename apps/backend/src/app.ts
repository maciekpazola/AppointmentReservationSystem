import express from "express";
import cors from "cors";
import userRoutes from "./modules/user/user.routes";
import appointmentRoutes from "./modules/appointment/appointment.routes";
import serviceRoutes from "./modules/service/service.routes";
import employeeRoutes from "./modules/employee/employee.routes";
import authRoutes from "./modules/auth/auth.routes";
import employeeScheduleRoutes from "./modules/employeeSchedule/employeeSchedule.routes";


const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:5173")
    .split(",")
    .map(origin => origin.trim());

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(express.json());


app.use(
    "/api/auth",
    authRoutes
);


app.use(
    "/api/users",
    userRoutes
);


app.use(
    "/api/appointments",
    appointmentRoutes
);


app.use(
    "/api/services",
    serviceRoutes
);


app.use(
    "/api/employee",
    employeeRoutes
);

app.use(
    "/api/employeeSchedule",
    employeeScheduleRoutes
);

export default app;
import express from "express";
import userRoutes from "./modules/user/user.routes";
import appointmentRoutes from "./modules/appointment/appointment.routes";
import serviceRoutes from "./modules/service/service.routes";


const app = express();


app.use(express.json());


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


export default app;
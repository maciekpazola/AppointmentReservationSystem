import { Router } from "express";
import { CustomerController } from "./customer.controller";
import { customerService } from "../../container";
import { validateDto } from "../../middleware/validation.middleware";
import { authenticate } from "../../middleware/auth.middleware";
import { CreateCustomerDto } from "../../dto/customer/create-customer.dto";

const router = Router();

const controller =
    new CustomerController(
        customerService
    );


router.post(
    "/",
    validateDto(CreateCustomerDto),
    controller.createCustomer
);

router.use(authenticate);

router.get(
    "/",
    controller.getCustomers
);

router.get(
    "/:id",
    controller.getCustomerById
);

export default router;

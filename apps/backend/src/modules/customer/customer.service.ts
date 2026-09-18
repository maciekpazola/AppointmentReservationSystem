import { CustomerMapper } from "./customer.mapper";
import { Repository } from "typeorm";
import { User } from "../../entities/user";
import { UserRole } from "../../enums/userRole";
import { CreateCustomerDto } from "../../dto/customer/create-customer.dto";

export class CustomerService {

    constructor(
        private customerRepository: Repository<User>
    ) {}


    async getCustomers() {

        const customers = await this.customerRepository.findBy({
            role: UserRole.CUSTOMER
        });
        const response = customers.map(CustomerMapper.toResponse);
        return response;
    }


    async getCustomerById(id: number) {

        const customer =
            await this.customerRepository.findOne({
                where: {
                    id,
                    role: UserRole.CUSTOMER
                }
            });


        if (!customer) {
            return null;
        }


        return CustomerMapper.toResponse(customer);
    }


    async createCustomer(dto: CreateCustomerDto) {

        const entity = await CustomerMapper.toEntity(dto);
        const customer = this.customerRepository.create(entity);
        await this.customerRepository.save(customer);
        return CustomerMapper.toResponse(customer);
    }
}

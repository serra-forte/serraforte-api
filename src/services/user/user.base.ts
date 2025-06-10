import { IUserRelations } from "@/dtos/user-relations.dto";
import { IOrderUserInfo } from "@/interfaces/order-user-info";

export abstract class UserServiceBase {
    abstract findById(User: IOrderUserInfo): Promise<IUserRelations>
    abstract updateAsaasCustomerId(id: string, asaasCustomerId: string): Promise<boolean>
    abstract updateUser(data: IUserRelations): Promise<IUserRelations>
}
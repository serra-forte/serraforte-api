import { IUserRelations } from "@/dtos/user-relations.dto";

export abstract class UserServiceBase {
    abstract findById(id: string): Promise<IUserRelations>
    abstract updateAsaasCustomerId(id: string, asaasCustomerId: string): Promise<boolean>
}
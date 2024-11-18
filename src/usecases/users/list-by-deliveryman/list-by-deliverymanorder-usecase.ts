import { IResponseListUsers, IUsersRepository } from "@/repositories/interfaces/interface-users-repository";

export interface IRequestListUsers{
    page?: number | null
    take?: number | null
}
export class ListByDeliveryManUsecase {
    constructor(
        private userRepository: IUsersRepository
    ){}

    async execute({
        page,
        take
    }: IRequestListUsers): Promise<IResponseListUsers> {
        const users = await this.userRepository.listByDeliveryMan(page, take)
        return users
    }
}
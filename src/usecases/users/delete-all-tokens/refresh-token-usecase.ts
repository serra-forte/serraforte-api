import { ITokensRepository } from '@/repositories/interfaces/interface-tokens-repository'
import 'dotenv/config'

export class DeleteAllTokensUseCase{
    constructor(
        private usersTokensRepository: ITokensRepository,
    ) {}

    async execute():Promise<void>{
        // Delete all tokens
        await this.usersTokensRepository.deleteAll()
    }
}
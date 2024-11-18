import 'dotenv/config'
import { IDateProvider } from '@/providers/DateProvider/interface-date-provider';
import { ICacheProvider } from '@/providers/CacheProvider/interface-cache';
import { AppError } from '@/usecases/errors/app-error';
import { ITokenOnUser } from '../login/login-usecase';
import axios from 'axios';
import { ITokensRepository } from '@/repositories/interfaces/interface-tokens-repository';

interface IRequestLogout {
    token: string
    refreshToken: string
    userId: string
}

export class LogoutUseCase{
    constructor(
        private usersTokensRepository: ITokensRepository,
        private cacheProvider: ICacheProvider,
        private dayjsDateProvider: IDateProvider
    ) {}

    async execute({
        token,
        refreshToken,
        userId
    }:IRequestLogout):Promise<void>{
        const userToken = await this.usersTokensRepository.findByUserAndToken(userId, refreshToken) as unknown as ITokenOnUser

        if(!userToken){
            throw new AppError('Refresh token não encontrado', 404)
        }

        //[x] adicionar token na blacklist
        await this.cacheProvider.addToBlackList(token)

        // deletar token do banco de dados do usuario
        await this.usersTokensRepository.deleteByUser(userToken.user.id)

        //[x] verificar se existe data de expiração no redi
        const dataExpirateClearBlackList = await this.cacheProvider.getDatesToDeleteBlackList()
        if(dataExpirateClearBlackList.length === 0){
            const newDateExpire = JSON.stringify(this.dayjsDateProvider.addDays(7))
           await this.cacheProvider.addNewDateToDeleteBlackList(newDateExpire)
        }
        const [newDateExpire] = await this.cacheProvider.getDatesToDeleteBlackList()
        const dataExpirate = new Date(JSON.parse(newDateExpire))
        const dateNow = this.dayjsDateProvider.dateNow()
        const verifyExpireDate = this.dayjsDateProvider.compareIfBefore(dateNow, dataExpirate)

       if(!verifyExpireDate){
           await this.cacheProvider.clearBlackList()
           await this.cacheProvider.resetDatesToDeleteBlackList()
       }
    }
}
import 'dotenv/config'
import { AppError } from "@/usecases/errors/app-error";
import {Address, StoreHours, User } from "@prisma/client";
import { IUsersRepository } from '@/repositories/interfaces/interface-users-repository';

interface IRequestUpdateUser {
    id: string,
    name: string,
    email: string,
    phone?: string | null,
    dateBirth?: Date | null,
    cpf?: string | null,
    avatarUrl?: string | null,
    hasDeliveryMan: boolean,
    address?: {
        street?: string | null,
        num?: number | null,
        neighborhood?: string | null,
        city?: string | null,
        state?: string | null,
        country?: string | null,
        zipCode?: string | null,
        complement?: string | null,
        reference?: string | null,
    } | null
    storeHours: {
        dayOfWeek: string | null
        openTime: string | null
        closeTime: string | null
    }[] | undefined
}
interface IResponseUpdateUser {
    user: User
}

export class UpdateUserUseCase{
    constructor(
        private usersRepository: IUsersRepository,
    ) {}

    async execute({
        id,
        name,
        email,
        phone,
        hasDeliveryMan,
        dateBirth,
        cpf,
        address,
        avatarUrl,
        storeHours
    }:IRequestUpdateUser):Promise<IResponseUpdateUser>{
        const findUserExists = await this.usersRepository.getUserSecurity(id)
        if(!findUserExists){
            throw new AppError('Usuário não encontrado', 404)
        }

        let emailActive = findUserExists.emailActive;

        // buscar usuario pelo email
        const findUserByEmail = await this.usersRepository.findByEmail(email)

        if(findUserByEmail){
            // verificar email ja existe e se é o mesmo usuario
            if(findUserByEmail.id !== findUserExists.id){
                throw new AppError('Email já cadastrado', 409)
            }
        }

        if(email !== findUserExists.email){
            // chamar metodo para alterar email active para false
            // pois o email foi alterado e precisa ser validado novamente
            emailActive = false;
        }
        
        if(cpf){
            const findUserByCPF = await this.usersRepository.findByCPF(cpf)
        //[x] verificar se cpf ja existe
            if(findUserByCPF){
                if(findUserExists.id !== findUserByCPF.id){
                    throw new AppError('CPF já cadastrado', 409)
                }
            }

        }


        if(phone){
            const findUserByPhone = await this.usersRepository.findByPhone(phone)
            //[x] verificar se passport ja existe
            if(findUserByPhone){
                if(findUserExists.id !== findUserByPhone.id){
                    throw new AppError('Phone já cadastrado', 409)
                }
            }
        }

    //    await this.usersRepository.updateIdCostumerPayment(findUserExists.id, null)

    const userUpdated = await this.usersRepository.update({
        id,
        name,
        email,
        phone,
        dateBirth,
        cpf,
        hasDeliveryMan,
        emailActive,
        avatarUrl,
        address: {
            upsert:{
                create: address as unknown as Address,
                update: address as unknown as Address
            }
        },
        storeHours: {
            upsert: (storeHours || []).map((storeHour) => ({
              where: {
                userId_dayOfWeek: {
                  userId: id,
                  dayOfWeek: storeHour.dayOfWeek!,
                },
              },
              create: {
                dayOfWeek: storeHour.dayOfWeek!,
                openTime: storeHour.openTime!,
                closeTime: storeHour.closeTime!,
              },
              update: {
                openTime: storeHour.openTime!,
                closeTime: storeHour.closeTime!,
              },
            })),
          },
        })
    
        return {
            user: userUpdated
        }
    }
}
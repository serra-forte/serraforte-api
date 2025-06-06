import { makeUpdateUser } from '@/usecases/factories/users/make-update-user-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import {cpf as CPF} from 'cpf-cnpj-validator'
import { z } from 'zod'

export async function UpdateUser (request: FastifyRequest, reply:FastifyReply){
        try {
            const userSchemaBody = z.object({
              name: z.string().min(4), 
              cpf: z.string().optional().nullable(),  
              email: z.string().email(),
              phone: z.string().optional().nullable(), 
              dateBirth: z.string().optional().nullable(),
              avatarUrl: z.string().optional().nullable(),
              address: z.object({
                street: z.string().optional().nullable(),
                num: z.number().nonnegative().optional().nullable(),
                neighborhood: z.string().optional().nullable(),
                city: z.string().optional().nullable(),
                state: z.string().optional().nullable(),
                country: z.string().optional().nullable(),
                zipCode: z.string().optional().nullable(),
                complement: z.string().optional().nullable(),
                reference: z.string().optional().nullable(),
              }).optional().nullable(),
              storeHours: z.array(
                z.object({
                  dayOfWeek: z.string().optional().nullable(),
                  openTime: z.string().optional().nullable(),
                  closeTime: z.string().optional().nullable(),
                })
              )
            })

            const userSchemaParams = z.object({
                id: z.string().uuid()
            })

            const { 
                id,
            } = userSchemaParams.parse(request.params)

            const{
                name,
                phone,
                dateBirth,
                cpf,
                email,
                address,
                avatarUrl,
                storeHours
            } = userSchemaBody.parse(request.body)

            const updateUserUseCase = await makeUpdateUser()
            
            const {user} = await updateUserUseCase.execute({
                id,
                name,
                phone,
                email,
                dateBirth: dateBirth ? new Date(dateBirth) : null,
                cpf: CPF.format(cpf as string) ? CPF.format(cpf as string) : null,
                address,
                avatarUrl,
                storeHours: storeHours.length > 0 ? storeHours.map((storeHour) => {
                  return {
                      dayOfWeek: storeHour.dayOfWeek ? storeHour.dayOfWeek : null,
                      openTime: storeHour.openTime ? storeHour.openTime : null,
                      closeTime: storeHour.closeTime ? storeHour.closeTime : null
                  }
              }) : undefined
            })
            
            
            return reply.status(200).send(user)
            
          } catch (error) {
            throw error
          }
}
    

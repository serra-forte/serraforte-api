import { makeCreateUserByAdmin } from '@/usecases/factories/admins/make-create-user-by-admin-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function CreateUserByAdmin(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const userSchema = z.object({
      paymentPercent: z.number().optional().nullable(),   
      name: z.string().min(4),
      email: z.string().email(),
      phone: z.string(),
      incomeValue: z.number().optional().nullable(),
      address: z.string().optional().nullable(),
      addressNumber: z.string().optional().nullable(),
      cpf: z.string().optional().nullable(),
      province: z.string().optional().nullable(),
      postalCode: z.string().optional().nullable(),
      birthDate: z.string().optional().nullable(),
      city: z.string().optional().nullable(),
      role: z.enum(['DELIVERYMAN', 'SHOPKEEPER']),
      paymentType: z.enum(['FIXO', 'PERCENTAGE']),
      hasReceivePyaments: z.boolean(),
      hasDeliveryMan: z.boolean(),
      companyType: z.string().optional().nullable(),
      paymentFee: z.number().optional().nullable(),
      storeHours: z.array(
        z.object({
          dayOfWeek: z.string().optional().nullable(),
          openTime: z.string().optional().nullable(),
          closeTime: z.string().optional().nullable(),
        })
      )
    })

    const { 
      email, 
      name, 
      phone, 
      role,
      paymentFee,
      cpf,
      address,
      addressNumber,
      province,
      postalCode,
      paymentType,
      birthDate,
      incomeValue,
      companyType,
      hasReceivePyaments,
      hasDeliveryMan,
      storeHours,
      city,
    } = userSchema.parse(
      request.body,
    )

    const registerUseCase = await makeCreateUserByAdmin()

    const createUser = await registerUseCase.execute({
      email,
      name,
      mobilePhone: phone,
      role,
      paymentFee,
      cpfCnpj: cpf,
      companyType,
      address,
      addressNumber,
      hasReceivePyaments,
      hasDeliveryMan,
      paymentType,
      city,
      province,
      postalCode,
      birthDate: birthDate ? new Date(birthDate) : null,
      incomeValue,
      storeHours: storeHours.length > 0 ? storeHours.map((storeHour) => {
        return {
            dayOfWeek: storeHour.dayOfWeek ? storeHour.dayOfWeek : null,
            openTime: storeHour.openTime ? storeHour.openTime : null,
            closeTime: storeHour.closeTime ? storeHour.closeTime : null
        }
    }) : undefined
    })

    return reply.status(201).send(createUser)
  } catch (error) {
    throw error
  }
}

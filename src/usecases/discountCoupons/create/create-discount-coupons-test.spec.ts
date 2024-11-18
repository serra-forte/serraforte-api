import { beforeEach, describe, expect, test } from 'vitest'
import { CreateDiscountCounponUseCase } from './create-discount-coupons-usecase'
import { DayjsDateProvider } from '@/providers/DateProvider/implementations/provider-dayjs'
import { AppError } from '@/usecases/errors/app-error'

let discountCouponRepositoryInMemory: InMemoryDiscountCounponsRepository
let clinicRepositoryInMemory: InMemoryClinicRepository
let dayjsDateProvider: DayjsDateProvider
let stu: CreateDiscountCounponUseCase

describe('Create discount counpon (unit)', () => {
  beforeEach(async () => {
    discountCouponRepositoryInMemory = new InMemoryDiscountCounponsRepository()
    clinicRepositoryInMemory = new InMemoryClinicRepository(
      discountCouponRepositoryInMemory,
    )
    dayjsDateProvider = new DayjsDateProvider()
    stu = new CreateDiscountCounponUseCase(
      discountCouponRepositoryInMemory,
      clinicRepositoryInMemory,
      dayjsDateProvider,
    )
  })

  test('Should be able to create a discount counpon active', async () => {
    const clinic = await clinicRepositoryInMemory.create({
      id: '9c3dff89-03bc-4477-aa5d-67021af86354',
      name: 'Clinic Test',
      email: 'clinic@email.com',
      address: {
        create: {
          city: 'City Test',
          neighborhood: 'Neighborhood Test',
          num: 1,
          state: 'State Test',
          street: 'Street Test',
          zip: 'Zip Test',
          complement: 'Complement Test',
          reference: 'Reference Test',
        },
      },
    })
    const discountCounpon = await stu.execute({
      idClinic: '9c3dff89-03bc-4477-aa5d-67021af86354',
      name: 'Apuração dos olhos',
      code: 'PROMO10',
      discount: 10,
      startDate: new Date('2023-11-04'),
      expireDate: new Date('2023-12-04'),
      active: true,
    })
    expect(discountCounpon).toEqual(
      expect.objectContaining({
        name: 'Apuração dos olhos',
      }),
    )
  })

  test('Should be able to create a discount counpon not active', async () => {
    const clinic = await clinicRepositoryInMemory.create({
      id: '9c3dff89-03bc-4477-aa5d-67021af86354',
      name: 'Clinic Test',
      email: 'clinic1@email.com',
      address: {
        create: {
          city: 'City Test',
          neighborhood: 'Neighborhood Test',
          num: 1,
          state: 'State Test',
          street: 'Street Test',
          zip: 'Zip Test',
          complement: 'Complement Test',
          reference: 'Reference Test',
        },
      },
    })
    const discountCounpon = await stu.execute({
      idClinic: '9c3dff89-03bc-4477-aa5d-67021af86354',
      name: 'Apuração dos olhos',
      code: 'PROMO10',
      discount: 10,
      startDate: new Date('2023-11-04'),
      expireDate: new Date('2023-12-04'),
      active: false,
    })

    expect(discountCounpon).toEqual(
      expect.objectContaining({
        name: 'Apuração dos olhos',
      }),
    )
  })

  test('Should not be able to create a discount counpon with expiration date before start date', async () => {
    const clinic = await clinicRepositoryInMemory.create({
      id: '9c3dff89-03bc-4477-aa5d-67021af86354',
      name: 'Clinic Test',
      email: 'clinic2@email.com',
      address: {
        create: {
          city: 'City Test',
          neighborhood: 'Neighborhood Test',
          num: 1,
          state: 'State Test',
          street: 'Street Test',
          zip: 'Zip Test',
          complement: 'Complement Test',
          reference: 'Reference Test',
        },
      },
    })
    await expect(() =>
      stu.execute({
        idClinic: '9c3dff89-03bc-4477-aa5d-67021af86354',
        name: 'Apuração dos olhos',
        code: 'PROMO10',
        discount: 10,
        startDate: new Date('2023-11-04'),
        expireDate: new Date('2023-09-04'),
        active: true,
      }),
    ).rejects.toEqual(
      new AppError(
        'A data de expiração não pode ser anterior que a data de inicio',
        400,
      ),
    )
  })

  test('Should not be able to create discount counpon with code already exists', async () => {
    const clinic = await clinicRepositoryInMemory.create({
      id: '9c3dff89-03bc-4477-aa5d-67021af86354',
      name: 'Clinic Test',
      email: 'clinic3@email.com',
      address: {
        create: {
          city: 'City Test',
          neighborhood: 'Neighborhood Test',
          num: 1,
          state: 'State Test',
          street: 'Street Test',
          zip: 'Zip Test',
          complement: 'Complement Test',
          reference: 'Reference Test',
        },
      },
    })

    const discountCounpon = await stu.execute({
      idClinic: '9c3dff89-03bc-4477-aa5d-67021af86354',
      name: 'Apuração dos olhos',
      code: 'PROMO10',
      discount: 10,
      startDate: new Date('2023-11-04'),
      expireDate: new Date('2023-12-04'),
      active: false,
    })

    await expect(() =>
      stu.execute({
        idClinic: '9c3dff89-03bc-4477-aa5d-67021af86354',
        name: 'Apuração dos olhos',
        code: 'PROMO10',
        discount: 10,
        startDate: new Date('2023-11-04'),
        expireDate: new Date('2023-12-04'),
        active: false,
      }),
    ).rejects.toEqual(new AppError('Já existe um cupom com esse código', 409))
  })

  test('Should not be able to create discount counpon with idClinic invalid', async () => {
    await expect(() =>
      stu.execute({
        idClinic: 'b9936a69-a2c6-48cc-bd7e-d56164ff945e',
        name: 'Apuração dos olhos',
        code: 'PROMO10',
        discount: 10,
        startDate: new Date('2023-11-04'),
        expireDate: new Date('2023-12-04'),
        active: false,
      }),
    ).rejects.toEqual(new AppError('Clinica não encontrada', 404))
  })
})

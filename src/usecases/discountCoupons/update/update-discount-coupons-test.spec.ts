import { beforeEach, describe, expect, test } from 'vitest'
import { UpdateDiscountCounponUseCase } from './update-discount-coupons-usecase'
import { DayjsDateProvider } from '@/providers/DateProvider/implementations/provider-dayjs'
import { AppError } from '@/usecases/errors/app-error'

let discountCouponRepositoryInMemory: InMemoryDiscountCounponsRepository
let clinicRepositoryInMemory: InMemoryClinicRepository
let dayjsDateProvider: DayjsDateProvider
let stu: UpdateDiscountCounponUseCase

describe('Update discount counpon (unit)', () => {
  beforeEach(async () => {
    discountCouponRepositoryInMemory = new InMemoryDiscountCounponsRepository()
    clinicRepositoryInMemory = new InMemoryClinicRepository(
      discountCouponRepositoryInMemory,
    )
    dayjsDateProvider = new DayjsDateProvider()
    stu = new UpdateDiscountCounponUseCase(
      discountCouponRepositoryInMemory,
      dayjsDateProvider,
    )
  })

  test('Should be able to update a discount counpon', async () => {
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
    const discountCounpon = await discountCouponRepositoryInMemory.create({
      idClinic: '9c3dff89-03bc-4477-aa5d-67021af86354',
      name: 'Apuração dos olhos',
      code: 'PROMO10',
      discount: 10,
      startDate: new Date('2023-11-04'),
      expireDate: new Date('2023-12-04'),
      active: true,
    })

    const updateDiscountCounpon = await stu.execute({
      id: discountCounpon.id,
      name: 'Apuração dos olhos 1',
      code: 'PROMO10 1',
      discount: 10,
      startDate: new Date('2024-11-10'),
      expireDate: new Date('2024-12-10'),
      active: false,
    })

    expect(updateDiscountCounpon).toEqual(
      expect.objectContaining({
        name: 'Apuração dos olhos 1',
        code: 'PROMO10 1',
      }),
    )
  })

  test('Should not be able to update a discount counpon with invalid id', async () => {
    await expect(() =>
      stu.execute({
        id: '9c3dff89-03bc-4477-aa5d-67021af86354',
        name: 'Apuração dos olhos',
        code: 'PROMO10',
        discount: 10,
        startDate: new Date('2023-11-04'),
        expireDate: new Date('2023-12-04'),
        active: false,
      }),
    ).rejects.toEqual(new AppError('Coupon não encontrado', 404))
  })

  test('Should not be able to update a discount counpon with expiration date before start date', async () => {
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

    const discountCounpon = await discountCouponRepositoryInMemory.create({
      idClinic: '9c3dff89-03bc-4477-aa5d-67021af86354',
      name: 'Apuração dos olhos',
      code: 'PROMO10',
      discount: 10,
      startDate: new Date('2023-11-04'),
      expireDate: new Date('2023-12-04'),
      active: true,
    })

    await expect(() =>
      stu.execute({
        id: discountCounpon.id,
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
})

import { beforeEach, describe, expect, test } from 'vitest'
import { AppError } from '@/usecases/errors/app-error'
import { FindDiscountCounponByCodeUseCase } from './find-by-code-discount-coupons-usecase'

let discountCouponRepositoryInMemory: InMemoryDiscountCounponsRepository
let clinicRepositoryInMemory: InMemoryClinicRepository
let stu: FindDiscountCounponByCodeUseCase

describe('Find discount counpon by code (unit)', () => {
  beforeEach(async () => {
    discountCouponRepositoryInMemory = new InMemoryDiscountCounponsRepository()
    clinicRepositoryInMemory = new InMemoryClinicRepository(
      discountCouponRepositoryInMemory,
    )
    stu = new FindDiscountCounponByCodeUseCase(discountCouponRepositoryInMemory)

    await clinicRepositoryInMemory.create({
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
    await discountCouponRepositoryInMemory.create({
      idClinic: '9c3dff89-03bc-4477-aa5d-67021af86354',
      name: 'Apuração dos olhos',
      code: 'PROMO10',
      discount: 10,
      startDate: new Date('2023-11-04'),
      expireDate: new Date('2023-12-04'),
      active: true,
    })
  })

  test('Should be able to find a discount counpon by code', async () => {
    const discountCounpon = await stu.execute({
      code: 'PROMO10',
    })

    expect(discountCounpon).toEqual(
      expect.objectContaining({
        name: 'Apuração dos olhos',
      }),
    )
  })

  test('Should not be able to find a discount counpon by code invalid', async () => {
    expect(() =>
      stu.execute({
        code: 'PROMO11',
      }),
    ).rejects.toEqual(new AppError('Cupom não encontrado', 404))
  })

  test('Should not be able to find a discount counpon by code not active', async () => {
    await discountCouponRepositoryInMemory.create({
      idClinic: '9c3dff89-03bc-4477-aa5d-67021af86354',
      name: 'Apuração dos olhos',
      code: 'PROMO11',
      discount: 10,
      startDate: new Date('2024-11-04'),
      expireDate: new Date('2024-12-04'),
      active: false,
    })

    expect(() =>
      stu.execute({
        code: 'PROMO11',
      }),
    ).rejects.toEqual(new AppError('Cupom não está ativo', 400))
  })
})

import { beforeEach, describe, expect, test } from 'vitest'
import { AppError } from '@/usecases/errors/app-error'
import { ListDiscountCounponUseCase } from './list-discount-coupons-usecase'

let discountCouponRepositoryInMemory: InMemoryDiscountCounponsRepository
let clinicRepositoryInMemory: InMemoryClinicRepository
let stu: ListDiscountCounponUseCase

describe('List discount counpon (unit)', () => {
  beforeEach(async () => {
    discountCouponRepositoryInMemory = new InMemoryDiscountCounponsRepository()
    clinicRepositoryInMemory = new InMemoryClinicRepository(
      discountCouponRepositoryInMemory,
    )
    stu = new ListDiscountCounponUseCase(discountCouponRepositoryInMemory)
  })

  test('Should be able to list a discount counpon', async () => {
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

    for (let i = 1; i < 4; i++) {
      const discountCounpon = await discountCouponRepositoryInMemory.create({
        idClinic: '9c3dff89-03bc-4477-aa5d-67021af86354',
        name: 'Apuração dos olhos',
        code: `PROMO${i}0`,
        discount: 10,
        startDate: new Date('2023-11-04'),
        expireDate: new Date('2023-12-04'),
        active: true,
      })
    }
    const listDiscountCounpon = await stu.execute()

    expect(listDiscountCounpon).toHaveLength(3)
  })
})

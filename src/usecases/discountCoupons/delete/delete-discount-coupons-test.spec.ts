import { beforeEach, describe, expect, test } from 'vitest'
import { AppError } from '@/usecases/errors/app-error'
import { DeleteDiscountCounponUseCase } from './delete-discount-coupons-usecase'

let discountCouponRepositoryInMemory: InMemoryDiscountCounponsRepository
let clinicRepositoryInMemory: InMemoryClinicRepository
let stu: DeleteDiscountCounponUseCase

describe('Delete discount counpon by id (unit)', () => {
  beforeEach(async () => {
    discountCouponRepositoryInMemory = new InMemoryDiscountCounponsRepository()
    clinicRepositoryInMemory = new InMemoryClinicRepository(
      discountCouponRepositoryInMemory,
    )
    stu = new DeleteDiscountCounponUseCase(discountCouponRepositoryInMemory)

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
      id: '84ed45a9-8270-4153-b13e-53f3807afdef',
      idClinic: '9c3dff89-03bc-4477-aa5d-67021af86354',
      name: 'Apuração dos olhos',
      code: 'PROMO10',
      discount: 10,
      startDate: new Date('2023-11-04'),
      expireDate: new Date('2023-12-04'),
      active: true,
    })
  })

  test('Should be able to delete a discount counpon by id', async () => {
    const discountCounpon = await stu.execute({
      id: '84ed45a9-8270-4153-b13e-53f3807afdef',
    })

    const findDiscountCounpon = await discountCouponRepositoryInMemory.findById(
      '84ed45a9-8270-4153-b13e-53f3807afdef',
    )

    expect(findDiscountCounpon).toBeNull()
  })

  test('Should not be able to delete a discount counpon by code invalid', async () => {
    expect(() =>
      stu.execute({
        id: 'e6ea5ce4-3a12-43f8-89ad-dae5042d17af',
      }),
    ).rejects.toEqual(new AppError('Cupom não encontrado', 404))
  })
})

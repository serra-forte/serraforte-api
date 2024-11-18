import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import request from 'supertest'
import { fastifyApp } from '@/app'

describe('Create discount coupon (e2e)', () => {
  beforeAll(async () => {
    await fastifyApp.ready()
  })

  afterAll(async () => {
    await fastifyApp.close()
  })

  test('should be able to create a discount coupon active', async () => {
    const { accessToken, user } = await createAndAuthenticateUser(
      fastifyApp,
      'ADMIN',
    )

    const responseCreateClinic = await request(fastifyApp.server)
      .post(`/api/clinics`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        address: {
          street: 'Rua Teste',
          num: 123,
          complement: 'Complemento Teste',
          city: 'São Paulo',
          state: 'SP',
          zip: '12345678',
          neighborhood: 'Bairro Teste',
          reference: 'Referencia Teste',
        },
        name: 'Clinica Teste',
      })

    const { id: idClinic } = responseCreateClinic.body

    const responseCreateDiscountCoupon = await request(fastifyApp.server)
      .post(`/api/discount-coupons`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        clinic: {
          id: idClinic,
        },
        name: 'Inspeção ocular',
        code: 'PROMO10',
        discount: 10,
        startDate: '2023-11-04',
        expireDate: '2023-12-04',
        active: true,
      })

    expect(responseCreateDiscountCoupon.statusCode).toEqual(201)
  })

  test('should be able to create a discount coupon not active', async () => {
    const { accessToken, user } = await createAndAuthenticateUser(
      fastifyApp,
      'ADMIN',
      'fbd6b742-3beb-454e-a417-34dfa0ae0b1c',
      'user111@email.com',
      '131.888.541-51',
    )

    const responseCreateClinic = await request(fastifyApp.server)
      .post(`/api/clinics`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        address: {
          street: 'Rua Teste',
          num: 123,
          complement: 'Complemento Teste',
          city: 'São Paulo',
          state: 'SP',
          zip: '12345678',
          neighborhood: 'Bairro Teste',
          reference: 'Referencia Teste',
        },
        name: 'Clinica Teste 4',
      })

    const { id: idClinic } = responseCreateClinic.body

    const responseCreateDiscountCoupon = await request(fastifyApp.server)
      .post(`/api/discount-coupons`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        clinic: {
          id: idClinic,
        },
        name: 'Inspeção ocular',
        code: 'PROMO15',
        discount: 10,
        startDate: '2023-11-04',
        expireDate: '2023-12-04',
        active: false,
      })

    expect(responseCreateDiscountCoupon.statusCode).toEqual(201)
  })

  test('should not be able to create a discount coupon witj invalid idClinic', async () => {
    const { accessToken, user } = await createAndAuthenticateUser(
      fastifyApp,
      'ADMIN',
      '617388e1-ed7b-49c4-a129-49696acd9458',
      'user112@email.com',
      '131.222.541-51',
    )

    const responseCreateDiscountCoupon = await request(fastifyApp.server)
      .post(`/api/discount-coupons`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        clinic: {
          id: '27984ef2-39de-4e96-bf80-84b90386b9c6',
        },
        name: 'Inspeção ocular',
        code: 'PROMO16',
        discount: 10,
        startDate: '2023-11-04',
        expireDate: '2023-12-04',
        active: true,
      })

    expect(responseCreateDiscountCoupon.statusCode).toEqual(404)
  })

  test('should not be able to create a discount coupon with startDate before expirationDate', async () => {
    const { accessToken, user } = await createAndAuthenticateUser(
      fastifyApp,
      'ADMIN',
      'f84fbdfb-1dd8-469f-84e6-e9c4ccff03a3',
      'user11@email.com',
      '131.444.541-51',
    )

    const responseCreateClinic = await request(fastifyApp.server)
      .post(`/api/clinics`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        address: {
          street: 'Rua Teste',
          num: 123,
          complement: 'Complemento Teste',
          city: 'São Paulo',
          state: 'SP',
          zip: '12345678',
          neighborhood: 'Bairro Teste',
          reference: 'Referencia Teste',
        },
        name: 'Clinica Teste 3',
      })

    const { id: idClinic } = responseCreateClinic.body

    const responseCreateDiscountCoupon = await request(fastifyApp.server)
      .post(`/api/discount-coupons`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        clinic: {
          id: idClinic,
        },
        name: 'Inspeção ocular',
        code: 'PROMO12',
        discount: 10,
        startDate: '2023-11-04',
        expireDate: '2023-09-04',
        active: true,
      })

    expect(responseCreateDiscountCoupon.statusCode).toEqual(400)
  })

  test('should not be able to create a discount coupon with code already exists', async () => {
    const { accessToken, user } = await createAndAuthenticateUser(
      fastifyApp,
      'ADMIN',
      '9d292a63-ec48-44d1-8b31-c7c9f9c97013',
      'user1@email.com',
      '131.123.541-51',
    )

    const responseCreateClinic = await request(fastifyApp.server)
      .post(`/api/clinics`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        address: {
          street: 'Rua Teste',
          num: 123,
          complement: 'Complemento Teste',
          city: 'São Paulo',
          state: 'SP',
          zip: '12345678',
          neighborhood: 'Bairro Teste',
          reference: 'Referencia Teste',
        },
        name: 'Clinica Teste 2',
      })

    const { id: idClinic } = responseCreateClinic.body

    await request(fastifyApp.server)
      .post(`/api/discount-coupons`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        clinic: {
          id: idClinic,
        },
        name: 'Inspeção ocular',
        code: 'PROMO11',
        discount: 10,
        startDate: '2023-11-04',
        expireDate: '2023-12-04',
        active: true,
      })

    const responseCreateDiscountCoupon = await request(fastifyApp.server)
      .post(`/api/discount-coupons`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        clinic: {
          id: idClinic,
        },
        name: 'Inspeção ocular',
        code: 'PROMO11',
        discount: 10,
        startDate: '2023-11-04',
        expireDate: '2023-12-04',
        active: true,
      })

    expect(responseCreateDiscountCoupon.statusCode).toEqual(409)
  })
})

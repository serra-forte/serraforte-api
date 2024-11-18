import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";

describe('Send email forgot password (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to send email with link for reset password', async()=>{
        const responseRegisterUser = await request(fastifyApp.server).post('/api/users').send({
            dateBirth: '2023-10-03',
            email: 'email1@test.com',
            name: 'Kaio Moreira',
            phone: '77-77777-7777',
            password: '123456',
            rvLength: 10,
            rvPlate: 'ABC-1234',
            touristType: 'ADMIRADOR',
            tugPlate: 'ABC-1234',
            vehicleType: 'CAMPER',
        })

        const {email} = responseRegisterUser.body

        const response = await request(fastifyApp.server)
        .post(`/api/users/forgot-password`)
        .send({
            email: email
        })

        expect(response.statusCode).toEqual(200)
    })

    test('should not be able to reset password with email wrong', async()=>{
        const response = await request(fastifyApp.server)
        .post(`/api/users/forgot-password`)
        .send({
            email: 'fake@email.com'
        })

        expect(response.statusCode).toEqual(404)
    })

})
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";

describe('Delete User (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to delete a user', async()=>{
        const responseRegisterUser = await request(fastifyApp.server).post('/api/users').send({
            cpf: "140.658.490-99",
            dateBirth: '2023-10-03',
            email: 'email33@test.com',
            name: 'Kaio Moreira',
            phone: '77-77777-7777',
            password: '123456',
            rvLength: 10,
            rvPlate: 'ABC-1234',
            touristType: 'ADMIRADOR',
            tugPlate: 'ABC-1234',
            vehicleType: 'CAMPER',
        })

        const responseLoginUser = await request(fastifyApp.server)
        .post('/api/users/login')
        .send({
            email: 'email33@test.com',
            password: '123456',
        })

        const {accessToken, user} = responseLoginUser.body

        const responseDeleteUser = await request(fastifyApp.server)
        .delete(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()

        expect(responseDeleteUser.statusCode).toEqual(200)
    })

    test('should not be able to delete a user with invalid id', async()=>{
        const responseRegisterUser = await request(fastifyApp.server).post('/api/users').send({
            cpf: "524.658.490-93",
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

        const responseLoginUser = await request(fastifyApp.server)
        .post('/api/users/login')
        .send({
            email: 'email1@test.com',
            password: '123456',
        })

        const {accessToken, user} = responseLoginUser.body

        const fakeId = '70a2a313-3f71-4a01-8a64-ebf5b5ce23f2'

        const response = await request(fastifyApp.server)
        .delete(`/api/users/${fakeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
        expect(response.statusCode).toEqual(404)
    })
})
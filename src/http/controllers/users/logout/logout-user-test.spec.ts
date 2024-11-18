import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";

describe('Logout User (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to logout a user', async()=>{
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

        const responseLogin = await request(fastifyApp.server)
        .post('/api/users/login')
        .send({
            email: 'email1@test.com',
            password: '123456',
        })
        const {accessToken, refreshToken, user} = responseLogin.body

        const responseLogout = await request(fastifyApp.server)
        .post('/api/users/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            refreshToken,
        })

        const responseFindUser = await request(fastifyApp.server)
        .get(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()

        expect(responseFindUser.statusCode).toEqual(401)
    })

    test('should not be able to logout a user invalid', async()=>{
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

        const responseLogin = await request(fastifyApp.server)
        .post('/api/users/login')
        .send({
            email: 'email1@test.com',
            password: '123456',
        })
        const {accessToken} = responseLogin.body

        const responseLogout = await request(fastifyApp.server)
        .post('/api/users/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            refreshToken: 'fake-refresh-token',
        })

        expect(responseLogout.statusCode).toEqual(401)
    })

})
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { randomUUID } from "crypto";

describe('Find User (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to find a user', async()=>{
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
        const responseLoginUser = await request(fastifyApp.server)
        .post('/api/users/login')
        .send({
            email: 'email1@test.com',
            password: '123456',
        })


        const {accessToken, user} = responseLoginUser.body

        const responseFindUser = await request(fastifyApp.server)
        .get(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()

        expect(responseFindUser.statusCode).toEqual(200)
    })

    test('should not be able to find a user with invalid id', async()=>{
        const responseRegisterUser = await request(fastifyApp.server).post('/api/users').send({
            email: 'email2@test.com',
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
            email: 'email2@test.com',
            password: '123456',
        })

        const {accessToken, user} = responseLoginUser.body

        const fakeId = randomUUID()

        const responseFindUser = await request(fastifyApp.server)
        .get(`/api/users/${fakeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()

        
        expect(responseFindUser.statusCode).toEqual(404)
    })
})
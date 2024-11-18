import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { Token } from "@prisma/client";
import { prisma } from "@/lib/prisma";

describe('Reset passowrd (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to reset password a user', async()=>{
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

        const {id, email} = responseRegisterUser.body

        const {token} = await prisma.token.findFirstOrThrow({
            where:{
                userId: id
            }
        }) as unknown as Token

        const response = await request(fastifyApp.server)
        .patch(`/api/users/reset-password?token=${token}`)
        .send({
            password: '1234567'
        })

        expect(response.statusCode).toEqual(200)
    })

    test('should not be able to reset passowrd with token not valid', async()=>{
        const token = 'fake-token'
        const response = await request(fastifyApp.server)
        .patch(`/api/users/reset-password?token=${token}`)
        .send({
            password: '1234567798'
        })

        expect(response.statusCode).toEqual(404)
    })
})
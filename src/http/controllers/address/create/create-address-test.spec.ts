import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";

describe('Create Address (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to create a address with user', async()=>{
        const user = await prisma.user.create({
            data:{
             email: 'email12@test.com',
             name: 'Kaio Moreira',
             phone: '77-77777-7777',
             role: 'GUEST',
             password: await hash('123456', 8),
            }
         })
 
         const responseLoginUser = await request(fastifyApp.server)
         .post('/api/users/login')
         .send({
             email: 'email12@test.com',
             password: '123456'
         })

         const { accessToken } = responseLoginUser.body

        const responseAddress = await request(fastifyApp.server)
        .post('/api/address')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            user:{
                id: user.id
            },
            // announcement:{},
            street: 'Rua teste',
            num: 123,
            district: 'Bairro teste',
            country: 'Brasil',
            city: 'São Paulo',
            state: 'SP',
            zipCode: 123456,
            complement: 'Complemento teste',
            reference: 'Referencia teste',
        })

        expect(responseAddress.statusCode).toEqual(200)
    })

    test('should not be able to create a address with user invalid', async()=>{
        const user = await prisma.user.create({
            data:{
             email: 'email13@test.com',
             name: 'Kaio Moreira',
             phone: '77-77777-7777',
             role: 'GUEST',
             password: await hash('123456', 8),
            }
         })
 
         const responseLoginUser = await request(fastifyApp.server)
         .post('/api/users/login')
         .send({
             email: 'email13@test.com',
             password: '123456'
         })

         const { accessToken } = responseLoginUser.body

        const responseAddress = await request(fastifyApp.server)
        .post('/api/address')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            user:{
                id: '8916fe1e-d670-4b52-a989-0da2fe32cd1e'
            },
            // announcement:{},
            street: 'Rua teste',
            num: 123,
            district: 'Bairro teste',
            country: 'Brasil',
            city: 'São Paulo',
            state: 'SP',
            zipCode: 123456,
            complement: 'Complemento teste',
            reference: 'Referencia teste',
        })

        expect(responseAddress.statusCode).toEqual(404)
    })
    
})
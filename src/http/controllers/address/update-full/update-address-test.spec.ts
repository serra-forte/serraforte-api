import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";

describe('Update Address (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to update a address with user', async()=>{
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

        const responseCreateAddress = await request(fastifyApp.server)
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

        const { id } = responseCreateAddress.body

        const responseUpdateAddress = await request(fastifyApp.server)
        .put('/api/address')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            id,
            user:{
                id: user.id
            },
            // announcement:{},
            street: 'Rua teste 2',
            num: 1234,
            district: 'Bairro teste 2',
            country: 'Brasil 2',
            city: 'São Paulo 2',
            state: 'SP 2',
            zipCode: 1234567,
            complement: 'Complemento teste 2',
            reference: 'Referencia teste 2',
        })

        expect(responseUpdateAddress.statusCode).toEqual(200)
    })

    test('should not be able to update a address with id address invalid', async()=>{
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

        const responseUpdateAddress = await request(fastifyApp.server)
        .put('/api/address')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            id: 'b17cbc81-1162-4764-8bee-780f1706bcc1',
            user:{
                id: user.id
            },
            // announcement:{},
            street: 'Rua teste 2',
            num: 1234,
            district: 'Bairro teste 2',
            country: 'Brasil 2',
            city: 'São Paulo 2',
            state: 'SP 2',
            zipCode: 1234567,
            complement: 'Complemento teste 2',
            reference: 'Referencia teste 2',
        })


        expect(responseUpdateAddress.statusCode).toEqual(404)
    })

    test('should not be able to update a address with userId address invalid', async()=>{
        const user = await prisma.user.create({
            data:{
             email: 'email14@test.com',
             name: 'Kaio Moreira',
             phone: '77-77777-7777',
             role: 'GUEST',
             password: await hash('123456', 8),
            }
         })
 
         const responseLoginUser = await request(fastifyApp.server)
         .post('/api/users/login')
         .send({
             email: 'email14@test.com',
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

        const {id} = responseAddress.body

        const responseUpdateAddress = await request(fastifyApp.server)
        .put('/api/address')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            id,
            user:{
                id: '607e1c77-7be3-46a6-94dc-af48b0028ec2'
            },
            // announcement:{},
            street: 'Rua teste 2',
            num: 1234,
            district: 'Bairro teste 2',
            country: 'Brasil 2',
            city: 'São Paulo 2',
            state: 'SP 2',
            zipCode: 1234567,
            complement: 'Complemento teste 2',
            reference: 'Referencia teste 2',
        })

        expect(responseUpdateAddress.statusCode).toEqual(404)
    })
    
    // test('should be able to create a address with announcement', async()=>{
    //     const user = await prisma.user.create({
    //         data:{
    //          email: 'email12@test.com',
    //          name: 'Kaio Moreira',
    //          phone: '77-77777-7777',
    //          role: 'ADMIN',
    //          password: await hash('123456', 8),
    //         }
    //      })
 
    //      const responseLoginUser = await request(fastifyApp.server)
    //      .post('/api/users/login')
    //      .send({
    //          email: 'email12@test.com',
    //          password: '123456'
    //      })

    //      const { accessToken } = responseLoginUser.body

    //     const responseAddress = await request(fastifyApp.server)
    //     .post('/api/address')
    //     .set('Authorization', `Bearer ${accessToken}`)
    //     .send({
    //         user:{
    //             userId: user.id
    //         },
    //         // announcement:{},
    //         street: 'Rua teste',
    //         num: 123,
    //         district: 'Bairro teste',
    //         country: 'Brasil',
    //         city: 'São Paulo',
    //         state: 'SP',
    //         zipCode: 123456,
    //         complement: 'Complemento teste',
    //         reference: 'Referencia teste',
    //     })

    //     console.log(responseAddress.body)

    //     expect(responseAddress.statusCode).toEqual(200)
    // })

    // test('should not be able to create a address with announcement invalid', async()=>{
    //     const user = await prisma.user.create({
    //         data:{
    //          email: 'email13@test.com',
    //          name: 'Kaio Moreira',
    //          phone: '77-77777-7777',
    //          role: 'GUEST',
    //          password: await hash('123456', 8),
    //         }
    //      })
 
    //      const responseLoginUser = await request(fastifyApp.server)
    //      .post('/api/users/login')
    //      .send({
    //          email: 'email13@test.com',
    //          password: '123456'
    //      })

    //      const { accessToken } = responseLoginUser.body

    //     const responseAddress = await request(fastifyApp.server)
    //     .post('/api/address')
    //     .set('Authorization', `Bearer ${accessToken}`)
    //     .send({
    //         user:{
    //             userId: '8916fe1e-d670-4b52-a989-0da2fe32cd1e'
    //         },
    //         // announcement:{},
    //         street: 'Rua teste',
    //         num: 123,
    //         district: 'Bairro teste',
    //         country: 'Brasil',
    //         city: 'São Paulo',
    //         state: 'SP',
    //         zipCode: 123456,
    //         complement: 'Complemento teste',
    //         reference: 'Referencia teste',
    //     })

    //     expect(responseAddress.statusCode).toEqual(404)
    // })
})
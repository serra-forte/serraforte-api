import { $Enums, Prisma, User } from "@prisma/client";
import { IUsersRepository } from "../interface-users-repository";
import { randomUUID } from "crypto";

export class InMemoryUsersRepository implements IUsersRepository{
    public users: User[] = []
    
    constructor(){}
    async listAdmins(){
        const users = this.users.filter(user => user.role === 'ADMIN')

        return users
    }
    
    async findByIdCostumerPayment(id: string){
        const user = this.users.find(user => user.idCustomerAsaas === id)

        if(!user){
            return null
        }   

        return user
    }

    async getUserSecurity(id: string){
        const user = this.users.find(user => user.id === id)

    if(!user){
        return null
    }
    const userSecurity:User = {
        id: user.id,
        idCustomerAsaas: user.idCustomerAsaas,
        email: user.email,
        cpf: user.cpf,
        passport: user.passport,
        name: user.name,
        phone: user.phone,
        role: user.role,
        dateBirth: user.dateBirth,
        emailActive: user.emailActive,
        createdAt: user.createdAt,
    } as User

    return userSecurity;
    }
  
    async changePassword(id: string, password: string){
        const userIndex = this.users.findIndex(user => user.id === id)

        if(userIndex === -1){
            return null
        }

        this.users[userIndex].password = password
    }

    async updateIdCostumerPayment(userId: string, idCustomerPayment: string){
        const userIndex = this.users.findIndex(user => user.id === userId)

        this.users[userIndex].idCustomerAsaas = idCustomerPayment as string

        return this.users[userIndex]
    }

    async turnAdmin(id: string){
        const userIndex = this.users.findIndex(user => user.id === id)

        this.users[userIndex].role = 'ADMIN'

        return this.users[userIndex]
    }    
    
    async create({
        id,
        idCustomerAsaas,
        cpf,
        dateBirth,
        email,
        name,
        passport,
        password,
        phone,
        emailActive,
        role,
    }: Prisma.UserUncheckedCreateInput) {
        const user = {
            id: id ? id : randomUUID(),
            idCustomerAsaas: idCustomerAsaas ? idCustomerAsaas : null,
            dateBirth: dateBirth ? new Date(dateBirth) : null,
            email,
            name,
            passport: passport ? passport : null,
            password,
            phone: phone ? phone : null,
            address: [],
            leads: [],
            posts: [],
            tokens: [],
            emailActive: emailActive ? emailActive : false,
            role: role ? role : 'GUEST',
            cpf: cpf ? cpf : null,
            createdAt: new Date()
            }
        
        this.users.push(user)

        return user;
    }

    async list() {
        return this.users
    }

    async findById(id: string){
        const user = this.users.find(user => user.id === id)

        if(!user){
            return null
        }

        return user;
    }

    async findByEmail(email: string){
        const user = this.users.find(user => user.email === email)

        if(!user){
            return null
        }

        return user;
    }

    async findByCPF(cpf: string){
        const user = this.users.find(user => user.cpf === cpf)

        if(!user){
            return null
        }

        return user;
    }

    async findByPassport(passport: string){
        const user = this.users.find(user => user.passport === passport)

        if(!user){
            return null
        }

        return user;
    }

    async activeEmail(id:string, activate = true) {
        const userIndex = this.users.findIndex(user => user.id === id)

        if(userIndex === -1){
            return null
        }

        this.users[userIndex].emailActive = activate
    }

    async update({ 
        id,
        dateBirth,
        email,
        name,
        passport,
        cpf,
        phone,
    }:Prisma.UserUncheckedUpdateInput){
        const userIndex = this.users.findIndex(user => user.id === id)
        
        this.users[userIndex].dateBirth = new Date(dateBirth as string)
        this.users[userIndex].email = email as string
        this.users[userIndex].name = name as string
        this.users[userIndex].passport = passport as string | null
        this.users[userIndex].phone = phone as string
        this.users[userIndex].cpf = cpf as string

        return this.users[userIndex]
    }

    async delete(id: string){
        const userIndex = this.users.findIndex(user => user.id === id)

        this.users.splice(userIndex, 1)
    }
}
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";

async function seedSuper(){
   try {
    const findUserSuper = await prisma.user.findUnique({
        where:{
            id: '7b606dce-5419-4f79-8540-6ed63deea125'
        }
    })

    if(findUserSuper){
        throw new Error('User Super already exists!')
    }

    const admin = await prisma.user.create({
        data:{
            id: '7b606dce-5419-4f79-8540-6ed63deea125',
            name: 'Admin',
            email: 'kaiomoreira.dev@gmail.com',
            password: await hash('159753', 8),
            cpf: '249.715.637-92',
            phone: '77-77777-7777',
            role: 'SUPER',
            emailActive: true,
            createdAt: new Date(),
            shoppingCart:{
                create: {
                    expireDate: new Date()
                }
            }
        }
    })

    console.log(admin)
    
    await prisma.$disconnect()
   } catch (error) {
    await prisma.$disconnect()
   }
}
seedSuper()
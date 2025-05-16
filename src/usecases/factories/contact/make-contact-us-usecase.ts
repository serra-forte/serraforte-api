import { MailProvider } from "@/providers/MailProvider/implementations/provider-sendgrid";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { ContactUsUseCase } from "@/usecases/contact/contact-us-usecase"

export async function makeContactUs(): Promise<ContactUsUseCase> {
    const usersRepository = new PrismaUsersRepository();
    const mainRepository = new MailProvider();
    const contactUsUseCase = new ContactUsUseCase(
        mainRepository,
        usersRepository
    )
    return contactUsUseCase
}
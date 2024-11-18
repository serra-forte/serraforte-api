import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { UploadAvatarUserUseCase } from "@/usecases/users/upload-avatar/upload-avatar-users-usecase";

export async function makeUploadAvatar(): Promise<UploadAvatarUserUseCase> {
    const usersRepository = new PrismaUsersRepository();

    const uploadAvatarUserUseCase = new UploadAvatarUserUseCase(usersRepository)

    return uploadAvatarUserUseCase
}
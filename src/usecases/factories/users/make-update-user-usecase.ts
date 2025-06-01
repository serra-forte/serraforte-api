import { BierHeldProvider } from "@/providers/BierHeldProvider/implementations/bier-held-provider";
import { RemoteConfigProviderFirebase } from "@/providers/RemoteConfigProvider/implementations/provider-remote-config";
import { PrismaAddressesRepository } from "@/repositories/prisma/prisma-addresses-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { UpdateUserUseCase } from "@/usecases/users/update-full/update-user-usecase";

export async function makeUpdateUser(): Promise<UpdateUserUseCase> {
    const usersRepository = new PrismaUsersRepository();
     const addressRepository = new PrismaAddressesRepository();
     const bierHeldProvider = new BierHeldProvider();
     const remoteConfig = new RemoteConfigProviderFirebase()
    const updateUserUseCase = new UpdateUserUseCase(usersRepository, addressRepository, bierHeldProvider,remoteConfig)

    return updateUserUseCase
}
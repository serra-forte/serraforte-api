import { RedisInMemoryProvider } from "@/providers/CacheProvider/implementations/provider-redis-in-memory"
import { VerifyTokenIsValidUseCase } from "@/usecases/auth/verify-is-token-valid/verify-is-token-valid-usecase"

export async function makeVerifyTokenValid(): Promise<VerifyTokenIsValidUseCase> {
    const redisProvider = new RedisInMemoryProvider()
    const verifyTokenIsValid = new VerifyTokenIsValidUseCase(
        redisProvider
    )

    return verifyTokenIsValid
}
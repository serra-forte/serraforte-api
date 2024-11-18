import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryCategoriesRepository } from "@/repositories/in-memory/in-memory-categories-repository";
import { FindCategoryUseCase } from "./find-by-id-categories-usecase";
import { AppError } from "@/usecases/errors/app-error";

let categoriesRepositoryInMemory: InMemoryCategoriesRepository
let stu: FindCategoryUseCase;

describe("Find category (unit)", () => {
    beforeEach(async() => {
        categoriesRepositoryInMemory = new InMemoryCategoriesRepository()
        stu = new FindCategoryUseCase(
            categoriesRepositoryInMemory
        )

        // criar categoria
        await categoriesRepositoryInMemory.create({
            id: 'a857ff33-3664-4a38-abab-fa6dfc31f1e2',
            name: "Smart Camping",
            description: "camping com espaço muito grande",
            type: "ATTRACTION"
        })
    });

    test("Should be able to find Category", async () => {
        const category = await stu.execute({ 
           id: 'a857ff33-3664-4a38-abab-fa6dfc31f1e2',
        });
        expect(category).toEqual(
            expect.objectContaining({
                name: "Smart Camping",
                description: "camping com espaço muito grande",
                type: "ATTRACTION"
            })
        )
        
    });

    test("Should not be able to find Category with invalid id", async () => {
        await expect(()=> stu.execute({ 
            id: '71e93499-aac1-4d6b-b9df-9e7a55669180',
         })).rejects.toEqual(new AppError('Category not found', 404))
    });
});
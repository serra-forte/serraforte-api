import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryCategoriesRepository } from "@/repositories/in-memory/in-memory-categories-repository";
import { UpdateCategoryUseCase } from "./update-categories-usecase";

let categoriesRepositoryInMemory: InMemoryCategoriesRepository
let stu: UpdateCategoryUseCase;

describe("Update category(unit)", () => {
    beforeEach(async() => {
        categoriesRepositoryInMemory = new InMemoryCategoriesRepository()
        stu = new UpdateCategoryUseCase(
            categoriesRepositoryInMemory
        )

        // criar categoria
        await categoriesRepositoryInMemory.create({
            id: 'a857ff33-3664-4a38-abab-fa6dfc31f1e2',
            name: "Smart Camping",
            description: "camping com espaço muito grande",
            type: "CAMPING"
        })
    });

    test("Should be able to update Category", async () => {
        const category = await stu.execute({ 
           id: 'a857ff33-3664-4a38-abab-fa6dfc31f1e2',
           name: "Chalé",
           description: "chalé com espaço muito grande",
           type: "CAMPING"
        });
        expect(category).toEqual(
            expect.objectContaining({
                name: "Chalé",
                description: "chalé com espaço muito grande",
                type: "CAMPING"
            })
        )
        
    });
});
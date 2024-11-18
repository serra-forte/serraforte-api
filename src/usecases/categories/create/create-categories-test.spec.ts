import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryCategoriesRepository } from "@/repositories/in-memory/in-memory-categories-repository";
import { CreateCategoryUseCase } from "./create-categories-usecase";

let categoriesRepositoryInMemory: InMemoryCategoriesRepository
let stu: CreateCategoryUseCase;

describe("Create category (unit)", () => {
    beforeEach(async() => {
        categoriesRepositoryInMemory = new InMemoryCategoriesRepository()
        stu = new CreateCategoryUseCase(
            categoriesRepositoryInMemory
        )
    });

    test("Should be able to create Category", async () => {
        const category = await stu.execute({ 
           name: "Smart Camping",
           description: "camping com espaço muito grande",
           type: "CAMPING"
        });
        expect(category).toEqual(
            expect.objectContaining({
                name: "Smart Camping",
                description: "camping com espaço muito grande",
                type: "CAMPING"
            })
        )
        
    });
});
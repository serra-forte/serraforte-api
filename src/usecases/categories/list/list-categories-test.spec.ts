import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryCategoriesRepository } from "@/repositories/in-memory/in-memory-categories-repository";
import { ListCategoryUseCase } from "./list-categories-usecase";

let categoriesRepositoryInMemory: InMemoryCategoriesRepository
let stu: ListCategoryUseCase;

describe("List categories (unit)", () => {
    beforeEach(async() => {
        categoriesRepositoryInMemory = new InMemoryCategoriesRepository()
        stu = new ListCategoryUseCase(
            categoriesRepositoryInMemory
        )
    });

    test("Should be able to list Category", async () => {
        for(let i = 0; i < 10; i++){
            await categoriesRepositoryInMemory.create({
                name: `categoria ${i}`,
                description: 'criando mais de uma categoria',
                type: "ATTRACTION"
            })
        }

        const categories = await stu.execute()

        expect(categories).toHaveLength(10)
    });
});
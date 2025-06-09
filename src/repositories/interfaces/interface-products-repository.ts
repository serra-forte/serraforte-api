import { IProductRelationsDTO } from "@/dtos/product-relations.dto"
import { Prisma, Product } from "@prisma/client"

export interface IFilterProducts {
    code?: number | null
    name?: string | null
    category?: string | null
    price?: boolean | null | string
    sales?: boolean | null | string   
    page?: number | null
}

export interface IResponseListProducts{
    products: IProductRelationsDTO[]
    totalPages: number
}

export interface IResponseFindProductWithReviews{
    product: IProductRelationsDTO
    totalPages: number
}

export interface IProductsRepository {
    create(data: Prisma.ProductCreateInput): Promise<Product>
    findById(id: string, page?: number | null): Promise<IResponseFindProductWithReviews | null>
    searchProducts(keyword:string): Promise<IResponseListProducts>
    filterProducts(filters: IFilterProducts): Promise<IResponseListProducts>
    list(page?: number | null): Promise<IResponseListProducts>
    listAll(): Promise<Product[]>
    listByCategoryId(id: string, page?: number | null): Promise<IResponseListProducts>
    listBySales(page?: number | null): Promise<IResponseListProducts>
    listBySalesAndShopkeeperId(shopkeeperId: string, page?: number | null): Promise<IResponseListProducts>
    findByName(name: string): Promise<Product | null>
    update(data: Prisma.ProductUpdateInput): Promise<Product>
    decrementQuantity(id: string, quantity: number): Promise<boolean>
    incrementQuantity(id: string, quantity: number): Promise<boolean>
    updateStatus(id: string, status: boolean): Promise<Product>
    updateSales(id: string, sales: number): Promise<void>
    delete(id: string): Promise<void>
    findByErpProductId(erpProductId: number): Promise<Product | null>
}
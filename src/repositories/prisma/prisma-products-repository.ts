import { Category, Prisma, Product } from "@prisma/client";
import { IFilterProducts, IProductsRepository, IResponseListProducts } from "../interfaces/interface-products-repository";
import { prisma } from "@/lib/prisma";
import { IProductRelationsDTO } from "@/dtos/product-relations.dto";

export class PrismaProductsRepository  implements IProductsRepository{
    async listAll(): Promise<Product[]> {
        const products = await prisma.product.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                erpProductId: true,
            }
        }) as unknown as Product[];

        return products
    }
    async findByErpProductId(erpProductId: number): Promise<Product | null> {
        const product = await prisma.product.findUnique({
            where: {
                erpProductId: erpProductId
            },
            select: {
                id: true
            }
        })
        return product as Product
    }
    async searchProducts(keyword: string) {
        // Normaliza a palavra-chave
        const lowerKeyword = keyword.trim().toLowerCase();
    
        // Verificar se o keyword é um nome de categoria
        const category = await prisma.category.findFirst({
            where: {
                name: {
                    contains: lowerKeyword,
                    mode: 'insensitive', // Pesquisa insensível a maiúsculas e minúsculas
                },
            },
        });
    
        let products;
        let countPage;
    
        if (category) {
            // Se uma categoria foi encontrada, buscar produtos dessa categoria
            products = await prisma.product.findMany({
                take: 13, // Limitar a 13 produtos por página
                where: {
                    categoryId: category.id, // Filtra por ID da categoria encontrada
                    active: true, // Considerando apenas produtos ativos
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    mainImage: true,
                    price: true,
                    quantity: true,
                    weight: true,
                    category: true, // Incluindo categoria nos resultados
                },
             }) as unknown as IProductRelationsDTO[]
    
            // Contar o número total de produtos nessa categoria
            countPage = await prisma.product.count({
                where: {
                    categoryId: category.id,
                    active: true,
                },
            });
    
        } else {
            // Se não foi encontrada uma categoria, buscar produtos pelo nome e descrição
            products = await prisma.product.findMany({
                take: 13, // Limitar a 13 produtos por página
                where: {
                    AND: [
                        {
                            name: {
                                contains: lowerKeyword,
                                mode: 'insensitive', // Pesquisa case-insensitive para o nome
                            },
                        },
                        {
                            active: true, // Considerando apenas produtos ativos
                        },
                    ],
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    mainImage: true,
                    price: true,
                    quantity: true,
                    weight: true,
                    category: true, // Incluindo categoria nos resultados
                },
             }) as unknown as IProductRelationsDTO[]
    
            // Contar o número total de produtos que correspondem aos filtros
            countPage = await prisma.product.count({
                where: {
                    AND: [
                        {
                            name: {
                                contains: lowerKeyword,
                                mode: 'insensitive', // Pesquisa case-insensitive para o nome
                            },
                        },
                        {
                            active: true, // Considerando apenas produtos ativos
                        },
                    ],
                },
            });
        }
    
        // Calcular o número total de páginas
        const totalPages = countPage > 0 ? Math.ceil(countPage / 13) : 0;
    
        return {
            products,
            totalPages,
        };
    }
    async filterProducts(filters: IFilterProducts) {
        let categoryId = ''
        let page = filters.page ? filters.page : 1
        
        const price = filters.price === 'true' ? true : filters.price === 'false' ? false : null;
        const sales = filters.sales === 'true' ? true : filters.sales === 'false' ? false : null;

        if(filters.category !== ''){
            const category = await prisma.category.findFirst({
                where: {
                    name:{
                        contains: filters.category as string,
                        mode: 'insensitive', // Pesquisa insensível a maiúsculas e minúsculas
                    }
                },
            }) as Category;
            categoryId = category?.id as string
        }

        // Definindo a ordenação de forma condicional
        const orderByConditions: Prisma.ProductOrderByWithRelationInput[] = [];
    
        if (price !== null) {
            orderByConditions.push({ price: price ? 'desc' : 'asc' });
        }
        
        if (sales !== null) {
            orderByConditions.push({ sales: sales ? 'desc' : 'asc' });
        }
        
        // Se nenhum dos campos price ou sales foi adicionado, ordenar por createdAt
        if (orderByConditions.length === 0) {
            orderByConditions.push({ createdAt: 'desc' });
        }

        // Construir o objeto de filtros para o Prisma
        const products = await prisma.product.findMany({
            take: 13,
            skip: page ? (page - 1) * 13 : 0,
            where: {
                AND: [
                  filters.code ? { code: filters.code } : {},
                  filters.name ? { name: { contains: filters.name, mode: 'insensitive' } } : {},
                  categoryId ? { categoryId  } : {},
                ],
              },
            // Adicionar ordenação condicional com base no filtro `sales`
            orderBy: orderByConditions,
            select: {
                id: true,
                code: true,
                erpProductId: true,
                width: true,
                height: true,
                length: true,
                name: true,
                description: true,
                price: true,
                sales: true,
                active: true,
                mainImage: true,
                quantity: true,
                weight: true,
                createdAt: true,
                averageRating:true,
                boxes: true,
                category: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        emailActive: true,
                        role: true,
                        avatarUrl: true
                    }
                },
                reviews: {
                    select: {
                        id: true,
                        user: {
                            select:{
                                id: true,
                                name: true,
                                email: true,
                                avatarUrl: true
                            }
                        },
                        product: {
                            select: {
                                id: true,
                                name: true
                            }
                        },
                        comment: true,
                        rating: true,
                        createdAt: true,
                    }
                },
            }
        }) as unknown as IProductRelationsDTO[]

        const countPage = await prisma.product.count({
            where: {
                AND: [
                  filters.code ? { code: filters.code } : {},
                  filters.name ? { name: { contains: filters.name, mode: 'insensitive' } } : {},
                  filters.category ? { categoryId: filters.category } : {},
                ],
              },
        })

        const totalPages = countPage > 0 ? Math.ceil(countPage / 13) : 1;

         // Calcular a média das avaliações para cada produto
         products.map(product => {
            const totalReviews = product.reviews.length;
            if (totalReviews > 0) {
                product.averageRating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews;
            } else {
                product.averageRating = 0;  // Ou 0, dependendo da sua lógica
            }
            return product;
        });
    
       
    
        return { products, totalPages };
    }
    async listBySalesAndShopkeeperId(shopkeeperId: string, page?: number | null) {
        const products = await  prisma.product.findMany({
            where: {
                user:{
                    id: shopkeeperId
                }
            },
            orderBy:{
                sales: 'desc'
            },
            take: 13,
            skip: page ? (page - 1) * 13 : 0,
            select:{
                id: true,
                code:true,
                erpProductId: true,
                name: true,
                description: true,
                price: true,
                sales:true,
                height:true,
                width: true,
                length: true,
                active: true,
                mainImage: true,
                quantity: true,
                weight: true,
                createdAt: true,
                user:{
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        emailActive: true,
                        role: true,
                    }
                },
                category: true
            }
         }) as unknown as IProductRelationsDTO[]

        const countPage = await prisma.product.count({
            where: {
                userId: shopkeeperId
            }
        })

        const totalPages = countPage > 0 ? Math.ceil(countPage / 13) : 0

        return {
            products, 
            totalPages
        }
    }
    async listBySales(page = 1) {
        const products = await  prisma.product.findMany({
            orderBy:{
                sales: 'desc'
            },
            take: 13,
            skip: (page - 1) * 13,
            select:{
                id: true,
                code:true,
                erpProductId: true,
                name: true,
                description: true,
                price: true,
                sales:true,
                height:true,
                width: true,
                length: true,
                active: true,
                mainImage: true,
                quantity: true,
                weight: true,
                createdAt: true,
                averageRating:true,
                reviews: {
                    select: {
                        id: true,
                        user: {
                            select:{
                                id: true,
                                name: true,
                                email: true,
                                avatarUrl: true
                            }
                        },
                        product: {
                            select: {
                                id: true,
                                name: true
                            }
                        },
                        comment: true,
                        rating: true,
                        createdAt: true,
                    }
                },
                user:{
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        emailActive: true,
                        role: true,
                    }
                },
                category: true
            }
         }) as unknown as IProductRelationsDTO[]

        const countPage = await prisma.product.count()

        const totalPages = countPage > 0 ? Math.ceil(countPage / 13) : 0

        // Calcular a média das avaliações para cada produto
        const productsWithAverageRating = products.map(product => {
            const totalReviews = product.reviews.length;
            if (totalReviews > 0) {
                product.averageRating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews;
            } else {
                product.averageRating = 0;  // Ou 0, dependendo da sua lógica
            }
            return product;
        });

        return {
            products, 
            totalPages
        }
    }
    async updateSales(id: string, sales: number){
        await prisma.product.update({
            where: {id},
            data: {
                sales: {
                    increment: sales
                }
            }
        })
    }
    async updateStatus(id: string, status: boolean){
        const product = await prisma.product.update({
            where: {id},
            data: {
                active: status
            }
        })
        return product
    }
    async incrementQuantity(id: string, quantity: number){
        try {
            const product = await prisma.product.update({
            where: {id},
            data: {
                quantity: {
                    increment: quantity
                }
            }
        })

        return true

        } catch (error) {
            throw error
        }
    }
    async decrementQuantity(id: string, quantity: number){
        try {
            await prisma.product.update({
            where: {id},
            data: {
                quantity: {
                    decrement: quantity
                }
            }
        })
        return true
        } catch (error) {
            throw error
        }
    }
    async listByCategoryId(id: string, page?: number | null) {
        // Buscar produtos pela categoria com avaliações
        const products = await prisma.product.findMany({
            where: {
                categoryId: id,
                active: true
            },
            take: 13,
            skip: page ? (page - 1) * 13 : 0,
            select: {
                id: true,
                code: true,
                erpProductId: true,
                width: true,
                height: true,
                length: true,
                name: true,
                description: true,
                price: true,
                sales: true,
                active: true,
                mainImage: true,
                quantity: true,
                weight: true,
                createdAt: true,
                averageRating:true,
                boxes: true,
                reviews: {
                    select: {
                        id: true,
                        user: {
                            select:{
                                id: true,
                                name: true,
                                email: true,
                                avatarUrl: true
                            }
                        },
                        product: {
                            select: {
                                id: true,
                                name: true
                            }
                        },
                        comment: true,
                        rating: true,
                        createdAt: true,
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        emailActive: true,
                        role: true,
                        avatarUrl: true
                    }
                },
                category: true
            }
        }) as unknown as IProductRelationsDTO[];
    
        // Calcular a média das avaliações para cada produto
        const productsWithAverageRating = products.map(product => {
            const totalReviews = product.reviews.length;
            if (totalReviews > 0) {
                product.averageRating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews;
            } else {
                product.averageRating = 0;  // Ou 0, dependendo de como você quer lidar com a ausência de avaliações
            }
            return product;
        });
    
        // Contar o total de produtos na categoria
        const countPage = await prisma.product.count({
            where: {
                categoryId: id
            }
        });
    
        // Calcular o total de páginas
        const totalPages = countPage > 0 ? Math.ceil(countPage / 13) : 0;
    
        return {
            products: productsWithAverageRating,
            totalPages
        };
    }
    async list(page?: number | null) {
        // Buscar produtos com avaliações
        const products = await prisma.product.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            take: 13,
            skip: page ? (page - 1) * 13 : 0,
            select: {
                id: true,
                code: true,
                width: true,
                height: true,
                length: true,
                name: true,
                description: true,
                price: true,
                sales: true,
                active: true,
                mainImage: true,
                quantity: true,
                weight: true,
                createdAt: true,
                averageRating:true,
                boxes: true,
                reviews: {
                    select: {
                        id: true,
                        user: {
                            select:{
                                id: true,
                                name: true,
                                email: true,
                                avatarUrl: true
                            }
                        },
                        product: {
                            select: {
                                id: true,
                                name: true
                            }
                        },
                        comment: true,
                        rating: true,
                        createdAt: true,
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        emailActive: true,
                        role: true,
                        avatarUrl: true
                    }
                },
                category: true
            }
        }) as unknown as IProductRelationsDTO[];
    
        // Calcular a média das avaliações para cada produto
        const productsWithAverageRating = products.map(product => {
            const totalReviews = product.reviews.length;
            if (totalReviews > 0) {
                product.averageRating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews;
            } else {
                product.averageRating = 0;  // Ou 0, dependendo da sua lógica
            }
            return product;
        });
    
        // Contar o total de produtos
        const countPage = await prisma.product.count();
    
        // Calcular o total de páginas
        const totalPages = countPage > 0 ? Math.ceil(countPage / 13) : 0;
    
        return {
            products: productsWithAverageRating,
            totalPages
        };
    }
    async findByName(name: string){
        const product = await prisma.product.findUnique({
            where: {name},
            select:{
                id: true,
                code:true,
                erpProductId: true,
                name: true,
                description: true,
                price: true,
                sales:true,
                height:true,
                width: true,
                length: true,
                active: true,
                mainImage: true,
                quantity: true,
                weight: true,
                createdAt: true,
                user:{
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        emailActive: true,
                        role: true,
                    }
                },
                category: true
            }
        }) as unknown as Product

        return product
    }
    async create(data: Prisma.ProductCreateInput){
        const product = await prisma.product.create({
            data,
            select:{
                id: true,
                code:true,
                erpProductId: true,
                name: true,
                description: true,
                price: true,
                sales:true,
                height:true,
                width: true,
                length: true,
                active: true,
                mainImage: true,
                quantity: true,
                weight: true,
                createdAt: true,
                user:{
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        emailActive: true,
                        role: true,
                    }
                },
                category: true
            }
        }) as unknown as Product

        return product
    }
    async findById(id: string, page?: number | null){
        const product = await prisma.product.findUnique({
            where: { id },
            select: {
                id: true,
                erpProductId: true,
                code: true,
                width: true,
                height: true,
                length: true,
                quantity: true,
                weight: true,
                price: true,
                name: true,
                mainImage: true,
                description: true,
                active: true,
                createdAt: true,
                sales: true,
                averageRating: true,
                boxes: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        emailActive: true,
                        role: true,
                        avatarUrl: true
                    }
                },
                category: true,
                reviews: {
                    take: 13,
                    skip: page ? (page - 1) * 13 : 0,
                    orderBy: {
                        createdAt: 'desc'
                    },
                    select: {
                        id: true,
                        active: true,
                        user: {
                            select:{
                                id: true,
                                name: true,
                                email: true,
                                avatarUrl: true
                            }
                        },
                        product: {
                            select: {
                                id: true,
                                name: true
                            }
                        },
                        comment: true,
                        rating: true,
                        createdAt: true,
                    }
                },
            }
        }) as unknown as IProductRelationsDTO;
        // contagem das reviews
        // Primeiro, obtenha a contagem total de reviews
        const countPages = await prisma.review.count({
            where: { productId: id }
        });
        
        // Calcular o total de páginas
        const totalPages = countPages > 0 ? Math.ceil(countPages / 13) : 0;

        if (product.reviews && product.reviews.length > 0) {
            const totalReviews = product.reviews.length;
    
            // Calcular a média das avaliações
            product.averageRating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews;
    
            // Criar a string de distribuição de ratings
            const ratingCounts = [0, 0, 0, 0, 0];
            product.reviews.forEach(review => {
                const ratingIndex = review.rating - 1; // Ajustar índice para 0-based
                if (ratingIndex >= 0 && ratingIndex < 5) {
                    ratingCounts[ratingIndex]++;
                }
            });
    
            // Converter array para string separada por vírgulas
            const ratingDistribution = ratingCounts.join(',');
    
            // Adicionar a distribuição de ratings no produto
            product.ratingDistribution = ratingDistribution;
        } else {
            product.averageRating = 0; // Ou null, se preferirr
            product.ratingDistribution = "0,0,0,0,0";
        }

        product.reviewCount = countPages;
    
        return {
            product,
            totalPages
        };
    }
    async update(data: Prisma.ProductUpdateInput){
        const product = await prisma.product.update({
            where: {id: data.id as string}, 
            data,
            select:{
                id: true,
                code:true,
                erpProductId: true,
                name: true,
                description: true,
                price: true,
                sales:true,
                height:true,
                width: true,
                length: true,
                active: true,
                mainImage: true,
                quantity: true,
                weight: true,
                createdAt: true,
                user:{
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        emailActive: true,
                        role: true,
                    }
                },
                category: true
            }
        }) as unknown as Product

        return product
    }
    async delete(id: string): Promise<void> {
        await prisma.product.delete({where: {id}})
    }
}
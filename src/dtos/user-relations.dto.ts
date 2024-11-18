import { Address, Role, ShoppingCart } from "@prisma/client";

export interface IUserRelations {
    id: string;
    asaasCustomerId: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    dateBirth: Date;
    cpf: string;
    emailActive: boolean;
    role: Role;
    createdAt: Date;
    refundCredit: number;
    expireRefundCredit: Date;
    shoppingCart: ShoppingCart
    paymentFee: number
    asaasWalletId: string
    address: Address
}
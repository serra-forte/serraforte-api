import { User } from "@prisma/client";

export interface IDiscountCouponRelations {
    id: string;
    user: User;
    name: string;
    code: string;
    quantity: number;
    discount: number;
    startDate: Date;
    expireDate: Date;
    active: boolean;
}
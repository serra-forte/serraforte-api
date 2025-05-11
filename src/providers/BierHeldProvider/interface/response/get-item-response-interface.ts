export interface IGetItemResponse {
    id: number;
    name: string;
    price: number;
    itemable_id: number;
    itemable_type: string;
    description: string | null;
    resale_product_category: string;
    user_company_id: number;
    updated_at: string; // ISO 8601 string
    created_at: string; // ISO 8601 string
  }
  
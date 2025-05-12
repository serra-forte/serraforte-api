export interface IItemResult {
    id?: number;
    name?: string;
    price?: number;
    liter_multiplier?: number;
    itemable_id?: number;
    itemable_type?: 'ResaleProduct' | 'Product' | 'Feedstock';
    description?: string;
    resale_product_category?: 'bottled_bottle' | 'bottled_barrel' | 'other_category' | 'kit';
  }
  
  export interface IListItemsResponse {
    current_page?: number;
    next_page?: number;
    total_pages?: number;
    total_entries?: number;
    offset?: number;
    results?: IItemResult[];
  }
  
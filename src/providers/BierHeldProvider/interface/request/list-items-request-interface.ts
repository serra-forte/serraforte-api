export interface IItemFilters {
    search?: string;
  }
  
  export interface IListItemsRequest {
    client_id: number;
    page?: number;
    per_page?: number;
    item_filters?: IItemFilters;
  }
  
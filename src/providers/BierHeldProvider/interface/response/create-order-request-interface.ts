interface ICreateOrderResponse{
    id: number;
    user_company_id: number;
    invoice_id: number;
    quotation_id?: number;
    order_value: number;
    delivery_value: number;
    return_value: number;
    debt_value: number;
    total_value: number;
    salesman_id: number;
    creator_id: number;
    additional_info: string;
    delivery_date_time: string; // ISO 8601
    delivery_method: 'delivery_at_client' | 'withdrawal_at_company' | 'delivery_by_shipper';
    delivered: number;
    return_date_time: string; // ISO 8601
    return_method: 'pick_up_at_client' | 'delivery_at_company';
    returned: number;
    shipper_id: number;
    pay_status: 'not_paid' | 'partially_paid' | 'paid';
    payments_paid_count: number;
    payments_count: number;
    block_delivery: boolean | 0 | 1;
    tags: string[];
    clientable_id: number;
    clientable_type: 'PersonClient' | 'CompanyClient';
  
    order_items_attributes: {
      id: number;
      reference_item_id?: number;
      name: string;
      price: number;
      quantity: number;
      discount: number;
      liter_price: number;
      liter_multiplier: number;
      batch_item_id: number;
      batch_item_code: number;
      delivered_at: string; // ISO 8601
    }[];
  
    address_attributes: {
      id: number;
      street?: string;
      number?: string;
      complement?: string;
      district?: string;
      nfe_city_code?: string;
      description?: string;
      nfe_city_name?: string;
      nfe_city_state_acronym?: string;
    };
  
    credit_entry_attributes: {
      id: number;
      user_company_id: number;
      value: number;
      clientable_id: number;
      clientable_type: 'PersonClient' | 'CompanyClient';
      additional_info: string;
    };
  
    payments_attributes: {
      id: number;
      user_company_id: number;
      employee_id: number;
      cash_opening_id: number;
      value: number;
      fee: number;
      auto_fee: boolean | 0 | 1;
      due_date: string; // dd/mm/aaaa
      pay_date: string; // dd/mm/aaaa
      reference_date: string; // dd/mm/aaaa
      pay_type_id: number;
      cash_account_id: string; // apesar do nome, string
      dre_account_id: number;
    }[];
  }
  
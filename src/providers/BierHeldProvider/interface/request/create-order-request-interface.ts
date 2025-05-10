export interface ICreateOrderRequest {
    send_order_mail?: boolean | 1 | 0
    client_mail?: string
    order: {
      client_id: number
      order_value: number
      delivery_value: number
      return_value: number
      total_value: number
      additional_info?: string
      delivery_date_time: string // ISO 8601 format
      delivery_method?: 'withdrawal_at_company' | 'delivery_by_shipper'
      return_date_time?: string // ISO 8601 format
      return_method?: 'pick_up_at_client' | 'delivery_at_company'
      shipper_id?: number // ID do transportador
      address_attributes?: {
        street?: string
        number?: string
        complement?: string
        district?: string
        description?: string
      }
      order_items_attributes?: {
        reference_item_id?: number
        name: string
        price: number
        quantity: number
        discount?: number
        liter_price?: number
        liter_multiplier?: number
      }[]
      payments_attributes?: {
        // Estrutura dos pagamentos, se conhecida
        pay_type_id: number
        value: number
      }[]
    }
  }
  
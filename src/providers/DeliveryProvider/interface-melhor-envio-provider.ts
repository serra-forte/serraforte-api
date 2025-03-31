export interface IRequestAuth {
    grant_type: string;
    client_id: number;
    client_secret: string;
    redirect_uri: string;
    code: string;
    refresh_token: string;
}

export interface IResponseAuth {
    token_type: string;
    expires_in: number;
    access_token: string;
    refresh_token: string;
}

export interface IPostalCode {
    postal_code: string;
}
  
export interface IProduct {
    id: string;
    width?: number | null;
    height?: number | null;
    length?: number | null;
    weight?: number | null;
    insurance_value: number;
    quantity: number;
}
  
export interface IOptions {
    receipt: boolean;
    own_hand: boolean;
}
  
export interface IRequestCalculateShipping {
    from: IPostalCode;
    to: IPostalCode;
    products?: IProduct[] | null;
    options?: IOptions | null;
    services?: string | null;
}

export interface IDeliveryRange {
    min: number;
    max: number;
}
  
export interface IDimensions {
    height: number;
    width: number;
    length: number;
}
  
export interface IPackage {
    price: string;
    discount: string;
    format: string;
    dimensions: IDimensions;
    weight: string;
    insurance_value: string;
    products: IProduct[];
  }
  
export interface IAdditionalServices {
    receipt: boolean;
    own_hand: boolean;
    collect: boolean;
}
  
export interface ICompany {
    id: number;
    name: string;
    picture: string;
  }
  
export interface IResponseCalculateShipping {
    id: number;
    name: string;
    price: string;
    custom_price: string;
    discount: string;
    currency: string;
    delivery_time: number;
    delivery_range: IDeliveryRange;
    custom_delivery_time: number;
    custom_delivery_range: IDeliveryRange;
    packages: IPackage[];
    additional_services?: IAdditionalServices | null;
    company: ICompany;
}

export interface IRequestSendFreightToCart {
    service: number; 
    agency?: number; 
    from: IShippingParty; 
    to: IShippingParty; 
    products: IProductInfo[]; 
    volumes: IVolumeInfo[]; 
    options?: IShippingOptions; 
  }
  
  export interface IShippingParty {
    name: string; 
    address: string; 
    complement?: string; 
    postal_code: string;
    phone?: string; 
    email?: string; 
    state_register?: string | null; 
    number: string;
    district?: string; 
    city: string; 
    state_abbr: string; 
    country_id: string;
    document?: string;
    note?: string;
  }
  
  export interface IProductInfo {
    name: string;
    quantity: number;
    unitary_value: number; 
  }
  export interface IVolumeInfo {
    weight: number; 
    length: number; 
    height: number;
    width: number; 
  }

  export interface Invoice{
    key: string
  }

  export interface IShippingOptions {
    insurance_value?: number; 
    receipt: boolean; 
    own_hand: boolean;
    reverse: boolean; 
    non_commercial: boolean; 
    invoice?: Invoice;
  }

  export interface IResponseSendFreightToCart {
    id: string;
    protocol: string;
    service_id: number;
    agency_id: string | null;
    contract: string | null;
    service_code: string | null;
    quote: number;
    price: number;
    coupon: string | null;
    discount: number;
    delivery_min: number;
    delivery_max: number;
    status: string;
    reminder: string | null;
    insurance_value: number;
    weight: number | null;
    width: number | null;
    height: number | null;
    length: number | null;
    diameter: number | null;
    format: string;
    billed_weight: number;
    receipt: boolean;
    own_hand: boolean;
    collect: boolean;
    collect_scheduled_at: string | null;
    reverse: number;
    non_commercial: boolean;
    authorization_code: string | null;
    tracking: string | null;
    self_tracking: string | null;
    delivery_receipt: string | null;
    additional_info: string | null;
    cte_key: string | null;
    paid_at: string | null;
    generated_at: string | null;
    posted_at: string | null;
    delivered_at: string | null;
    canceled_at: string | null;
    suspended_at: string | null;
    expired_at: string | null;
    created_at: string;
    updated_at: string;
    parse_pi_at: string | null;
    received_at: string | null;
  }
  
  export interface IVolume {
    id: number; 
    height: string; 
    width: string; 
    length: string; 
    diameter: string; 
    weight: string; 
    format: string; 
    created_at: string; 
    updated_at: string; 
  }
  
  export interface IPurchaseResponse {
    purchase: {
      id: string;
      protocol: string;
      total: number;
      discount: number;
      status: string;
      paid_at: string | null;
      canceled_at: string | null;
      created_at: string;
      updated_at: string;
      payment: string | null;
      transactions: {
        id: string;
        protocol: string;
        value: number;
        type: string;
        status: string;
        description: string;
        authorized_at: string | null;
        unauthorized_at: string | null;
        reserved_at: string | null;
        canceled_at: string | null;
        created_at: string;
        description_internal: string | null;
        reason: {
          id: number;
          label: string;
          description: string;
        };
      }[];
      orders: {
        id: string;
        protocol: string;
        service_id: number;
        agency_id: number | null;
        contract: string | null;
        service_code: string | null;
        quote: number;
        price: number;
        coupon: string | null;
        discount: number;
        delivery_min: number;
        delivery_max: number;
        status: string;
        reminder: string | null;
        insurance_value: number;
        weight: number | null;
        width: number | null;
        height: number | null;
        length: number | null;
        diameter: number | null;
        format: string;
        billed_weight: number;
        receipt: boolean;
        own_hand: boolean;
        collect: boolean;
        collect_scheduled_at: string | null;
        reverse: boolean;
        non_commercial: boolean;
        authorization_code: string | null;
        tracking: string | null;
        self_tracking: string | null;
        delivery_receipt: string | null;
        additional_info: string | null;
        cte_key: string | null;
        paid_at: string | null;
        generated_at: string | null;
        posted_at: string | null;
        delivered_at: string | null;
        canceled_at: string | null;
        suspended_at: string | null;
        expired_at: string | null;
        created_at: string;
        updated_at: string;
        parse_pi_at: string | null;
        from: {
          name: string;
          phone: string;
          email: string;
          document: string;
          company_document: string;
          state_register: string;
          postal_code: string;
          address: string;
          location_number: string;
          complement: string;
          district: string;
          city: string;
          state_abbr: string;
          country_id: string;
          latitude: number | null;
          longitude: number | null;
          note: string;
        };
        to: {
          name: string;
          phone: string;
          email: string;
          document: string;
          company_document: string;
          state_register: string;
          postal_code: string;
          address: string;
          location_number: string;
          complement: string;
          district: string;
          city: string;
          state_abbr: string;
          country_id: string;
          latitude: number | null;
          longitude: number | null;
          note: string;
        };
        service: {
          id: number;
          name: string;
          status: string;
          type: string;
          range: string;
          restrictions: string;
          requirements: string;
          optionals: string;
          company: {
            id: number;
            name: string;
            status: string;
            picture: string;
            use_own_contract: boolean;
          };
        };
        agency: {
          id: number;
          company_id: number;
          name: string;
          initials: string;
          code: string;
          status: string;
          company_name: string;
          email: string | null;
          note: string | null;
          created_at: string;
          updated_at: string;
          address: {
            id: number;
            label: string;
            postal_code: string;
            address: string;
            number: string | null;
            complement: string | null;
            district: string;
            latitude: number | null;
            longitude: number | null;
            confirmed_at: string | null;
            created_at: string;
            updated_at: string;
            city: {
              id: number;
              city: string;
              state: {
                id: number;
                state: string;
                state_abbr: string;
                country: {
                  id: string;
                  country: string;
                };
              };
            };
          };
          phone: {
            id: number;
            label: string;
            phone: string;
            type: string;
            country_id: string;
            confirmed_at: string | null;
            created_at: string;
            updated_at: string;
          };
        };
        invoice: {
          model: string;
          number: string;
          serie: string;
          key: string;
          value: string | null;
          cfop: string | null;
          issued_at: string;
          uploaded_at: string | null;
          to_document: string | null;
        };
        tags: string[];
        products: {
          name: string;
          quantity: number;
          unitary_value: number;
          weight: number | null;
        }[];
        generated_key: string | null;
      }[];
      paypal_discounts: string[];
    };
    digitable: string | null;
    redirect: string | null;
    message: string | null;
    token: string | null;
    payment_id: string | null;
  }

  export interface IResponseDetails {
    status: boolean;
    message: string;
  }
  
  export interface IResponseGenerateLabel {
    [key: string]: IResponseDetails;
  }

  export interface IResponseGenerateLabelLinkToPrinting {
    url: string;
  }

  interface ITrackingDetails {
    id: string;
    protocol: string;
    status: string;
    tracking: string;
    melhorenvio_tracking: string;
    created_at: string;
    paid_at: string;
    generated_at: string;
    posted_at: string;
    delivered_at: string | null;
    canceled_at: string | null;
    expired_at: string | null;
  }
  
  export interface ITrackingResponse {
    [key: string]: ITrackingDetails;
  }

 
  
export interface IMelhorEnvioProvider {
    authorization(code: string): Promise<IResponseAuth>
    shipmentCalculate(data: IRequestCalculateShipping): Promise<IResponseCalculateShipping[]>
    refreshToken(): Promise<IResponseAuth>
    addFreightToCart(data: IRequestSendFreightToCart):Promise<IResponseSendFreightToCart | null>
    paymentToFreight(orderId: string): Promise<IPurchaseResponse | null>
    generateLabel(orderId: string): Promise<IResponseGenerateLabel | null>
    generateLabelLinkToPrinting(orderId: string): Promise<IResponseGenerateLabelLinkToPrinting | null>
}
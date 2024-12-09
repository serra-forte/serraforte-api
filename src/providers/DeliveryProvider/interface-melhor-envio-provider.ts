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
    company?: ICompany | null;
}

export interface IRequestSendFreightToCart {
    service: number; // Id referente do serviço da transportadora
    agency?: number; // Id da agência/unidade onde será postado o envio (consultar regras das transportadoras)
    from: IShippingParty; // Informações do remetente do envio
    to: IShippingParty; // Informações do destinatário do envio
    products: IProductInfo[]; // Informações dos produtos que serão enviados
    volumes: IVolumeInfo[]; // Descrição dos volumes contidos no envio
    options?: IShippingOptions; // Informações complementares do envio
  }
  
  export interface IShippingParty {
    name: string; // Nome da pessoa ou empresa
    address: string; // Endereço completo
    complement?: string; // Complemento do destinatário (opcional)
    postal_code: string; // CEP
    phone?: string; // Telefone (opcional)
    email?: string; // Email (opcional)
    state_register?: string | null; // Estado de registro do remetente
    number: string; // Número do destinatário (opcional)
    district?: string; // Bairro do destinatário (opcional)
    city: string; // Cidade do destinatário (opcional)
    state_abbr: string; // Estado do destinatário (opcional)
    country_id: string; // País do destinatário (opcional)
    document?: string; // Documento do destinatário (opcional)
    note?: string; // Observação do destinatário (opcional)
  }
  
  export interface IProductInfo {
    id: string; // Id do produto
    name: string; // Nome do produto
    quantity: number; // Quantidade do produto
    price: number; // Preço do produto
    weight: number; // Peso do produto
  }
  
  export interface IVolumeInfo {
    weight: number; // Peso do volume
    length: number; // Comprimento do volume
    height: number; // Altura do volume
    width: number; // Largura do volume
  }
  
  export interface IShippingOptions {
    insuranceValue?: number; // Valor do seguro (opcional)
    receipt: boolean; // Reembolso (true) ou sem reembolso (false)
    own_hand: boolean; // Entrega em maos (true) ou sem entrega em maos (false)
    reverse: boolean; // Remessa reversa (true) ou remessa comercial (false)
    non_commercial: boolean; // Remessa comercial (true) ou remessa reversa (false)
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
    id: number; // ID do volume
    height: string; // Altura do volume
    width: string; // Largura do volume
    length: string; // Comprimento do volume
    diameter: string; // Diâmetro do volume
    weight: string; // Peso do volume
    format: string; // Formato do volume (ex: 'box')
    created_at: string; // Data de criação do volume
    updated_at: string; // Data de atualização do volume
  }
  
  
  
export interface IMelhorEnvioProvider {
    authorization(code: string): Promise<IResponseAuth>
    shipmentCalculate(data: IRequestCalculateShipping): Promise<IResponseCalculateShipping[]>
    refreshToken(): Promise<IResponseAuth>
    addFreightToCart(data: IRequestSendFreightToCart):Promise<IResponseSendFreightToCart | null>
    // paymentToFreight()
    // generateLabelTracking()
    // generateLabelLinkToPrinting()
}
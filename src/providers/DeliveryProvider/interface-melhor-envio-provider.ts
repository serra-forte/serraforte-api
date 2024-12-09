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
    id: string; // ID do envio
    protocol: string; // Protocolo do envio
    service_id: number; // ID do serviço da transportadora
    agency_id: number; // ID da agência/unidade
    contract: string | null; // Contrato, pode ser nulo
    service_code: string | null; // Código do serviço, pode ser nulo
    quote: number; // Cotação do envio
    price: number; // Preço do envio
    coupon: string | null; // Código do cupom, pode ser nulo
    discount: number; // Desconto aplicado
    delivery_min: number; // Prazo mínimo de entrega
    delivery_max: number; // Prazo máximo de entrega
    status: string; // Status do envio (ex: 'pending')
    reminder: string | null; // Lembrete, pode ser nulo
    insurance_value: number; // Valor do seguro
    weight: number | null; // Peso total, pode ser nulo
    width: number | null; // Largura, pode ser nulo
    height: number | null; // Altura, pode ser nulo
    length: number | null; // Comprimento, pode ser nulo
    diameter: number | null; // Diâmetro, pode ser nulo
    format: string; // Formato do volume (ex: 'box')
    billed_weight: number; // Peso faturado
    receipt: boolean; // Indica se será feita uma confirmação de recebimento
    own_hand: boolean; // Indica se o envio será entregue em mãos
    collect: boolean; // Indica se o envio é coletado
    collect_scheduled_at: string | null; // Data agendada para coleta, pode ser nulo
    reverse: boolean; // Indica se é uma remessa reversa
    non_commercial: boolean; // Indica se é uma remessa não comercial
    authorization_code: string | null; // Código de autorização, pode ser nulo
    tracking: string | null; // Código de rastreamento, pode ser nulo
    self_tracking: string | null; // Rastreamento próprio, pode ser nulo
    delivery_receipt: string | null; // Comprovante de entrega, pode ser nulo
    additional_info: string | null; // Informações adicionais, pode ser nulo
    cte_key: string | null; // Chave CTE, pode ser nulo
    paid_at: string | null; // Data de pagamento, pode ser nulo
    generated_at: string | null; // Data de geração, pode ser nulo
    posted_at: string | null; // Data de postagem, pode ser nulo
    delivered_at: string | null; // Data de entrega, pode ser nulo
    canceled_at: string | null; // Data de cancelamento, pode ser nulo
    suspended_at: string | null; // Data de suspensão, pode ser nulo
    expired_at: string | null; // Data de expiração, pode ser nulo
    created_at: string; // Data de criação
    updated_at: string; // Data de atualização
    parse_pi_at: string | null; // Data de parsing do PI, pode ser nulo
    products: {
        name: string; // Nome do produto
        quantity: number; // Quantidade do produto
        unitary_value: number; // Valor unitário do produto
        weight: number | null; // Peso do produto, pode ser nulo
      }[]; // Lista de produtos no envio
    volumes: IVolume[]; // Lista de volumes no envio
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
    addFreightToCart(data: IRequestSendFreightToCart):Promise<IResponseSendFreightToCart>
    // paymentToFreight()
    // generateLabelTracking()
    // generateLabelLinkToPrinting()
}
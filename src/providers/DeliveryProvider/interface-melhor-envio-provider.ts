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
  
export interface IMelhorEnvioProvider {
    authorization(code: string): Promise<IResponseAuth>
    shipmentCalculate(data: IRequestCalculateShipping): Promise<IResponseCalculateShipping[]>
    refreshToken(): Promise<IResponseAuth>
    // addFreightToCart()
    // paymentToFreight()
    // generateLabelTracking()
    // generateLabelLinkToPrinting()
}
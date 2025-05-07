export interface ICreateNaturalClientRequest {
    fullName: string;
    cpf?: string;
    contactAttributes: {
        contact_type: 'email' | 'cellphone';
        value: string;
    }[];
    addressAttributes?: {
      street: string;
      number?: string;
      complement?: string;
      neighborhood: string;
      city: string;
      state: string;
      zipCode: string;
    };
    birtDate?: Date;
  }
  
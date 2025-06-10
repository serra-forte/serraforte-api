export interface IUpdateNaturalClientRequest {
    id: number;
    fullName?: string | null;
    cpf?: string | null;
    birtDate?: Date | null;
    active: boolean;
    contactAttributes?: {
        contact_type?: 'email' | 'cellphone';
        value?: string;
        _destroy?: boolean;
    }[];
    addressAttributes?: {
      street?: string | null;
      number?: string | null;
      complement?: string | null;
      neighborhood?: string | null;
      city?: string | null;
      state?: string | null;
      zipCode?: string | null;
    };
  }
  
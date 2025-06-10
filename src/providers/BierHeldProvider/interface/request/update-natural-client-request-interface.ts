export interface IContactAttributes {
  id?: number | null;
  contact_type: 'email' | 'cellphone';
  value: string;
  _destroy?: boolean | null;
}

export interface IUpdateNaturalClientRequest {
    id: number;
    fullName?: string | null;
    cpf?: string | null;
    birtDate?: Date | null;
    active: boolean;
    contactAttributes?: IContactAttributes[];
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
  
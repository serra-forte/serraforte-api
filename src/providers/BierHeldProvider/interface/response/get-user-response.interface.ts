interface Contact {
  id: number;
  contact_type: 'email' | 'cellphone';
  description: string;
  value: string;
  contactable_id: number;
  contactable_type: string;
  updated_at: string;
  created_at: string;
}

interface Address {
  id: number;
  street: string;
  number: string;
  district: string;
  complement: string;
  zip: string;
  nfe_city_name: string | null;
  nfe_city_state_acronym: string | null;
  nfe_city_code: string | null;
  description: string;
  updated_at: string;
  created_at: string;
}

interface Tag {
  id: number;
  name: string;
  user_company_id: number;
  updated_at: string;
  created_at: string;
}

export interface IGetUserResponse {
  id: number;
  user_company_id: number;
  client_id: number;
  full_name: string;
  cpf: string;
  additional_info: string;
  contacts_attributes: Contact[];
  address_attributes: Address;
  credit_entries_value_sum: number;
  tags: Tag[];
  score: string;
  score_pct: number | null;
  preferred_salesman_id: number | null;
  client_group_id: number | null;
  pdv_client: boolean;
  employment: string;
  identity_num: string;
  identity_emissor: string;
  birth_date: string | null;
  nationality: string;
  monthly_income: number | null;
  fixed_residence: boolean;
  has_property: boolean;
  fixed_job: boolean;
  gender: string | null;
  civil_status: string | null;
  education_level: string | null;
  active: boolean;
  updated_at: string;
  created_at: string;
}
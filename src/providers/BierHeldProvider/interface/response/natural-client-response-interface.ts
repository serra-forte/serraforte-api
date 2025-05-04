export interface INaturalClientResponse {
  id?: number;
  client_id?: number;
  full_name?: string;
  cpf?: string;
  additional_info?: string;
  tags?: string[];
  score?: 'A' | 'B' | 'C';
  score_pct?: number;
  pdv_client?: boolean | 1 | 0;
  preferred_salesman_id?: number;
  client_group_id?: number;
  employment?: string;
  identity_num?: string;
  identity_emissor?: string;
  birth_date?: string;
  nationality?: string;
  monthly_income?: number;
  fixed_residence?: boolean | 1 | 0;
  has_property?: boolean | 1 | 0;
  fixed_job?: boolean | 1 | 0;
  gender?: 'male' | 'female';
  civil_status?:
    | 'single'
    | 'married'
    | 'separated'
    | 'divorced'
    | 'widowed'
    | 'stable_union';
  education_level?:
    | 'elementary_incomplete'
    | 'elementary_complete'
    | 'secondary_incomplete'
    | 'secondary_complete'
    | 'higher_incomplete'
    | 'higher_complete'
    | 'expertise'
    | 'master'
    | 'doctorate';
  active?: boolean | 1 | 0;

  address_attributes?: {
    id?: number;
    street?: string;
    number?: string;
    complement?: string;
    district?: string;
    nfe_city_code?: string;
    description?: string;
    nfe_city_name?: string;
    nfe_city_state_acronym?: string;
  };

  contacts_attributes?: {
    id?: number;
    contact_type?: 'email' | 'cellphone' | 'phone' | 'fax' | 'site' | 'other';
    value?: string;
    description?: string;
  }[];

  credit_entries_attributes?: {
    id?: number;
    value?: number;
    additional_info?: string;
  }[];

  credit_entries_value_sum?: number;
}
  
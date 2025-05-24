export interface Company {
  id: string;
  protocol: string;
  name: string;
  email: string | null;
  website: string | null;
  picture: string | null;
  thumbnail: string | null;
  description: string | null;
  company_name: string | null;
  document: string | null;
  state_register: string | null;
  created_at: string;
  updated_at: string;
}

export interface IListStoreResponse {
  current_page: number;
  data: Company[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

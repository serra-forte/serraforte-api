export interface ICreateStoreResponse {
  id: string;              // UUID da loja
  name: string;            // Nome da Loja / Ex: Melhor Loja
  email: string;           // E-mail de contato / Ex: contato@melhorloja.me
  description: string;     // Descrição da loja
  company_name: string;    // Nome da Loja
  document: string;        // Número do Documento / Ex: 89157108000104
  state_register: string;  // Inscrição Estadual / Ex: 476210979481
  created_at: string;      // Data de criação / Ex: 2022-03-30 16:53:56
  updated_at: string;      // Data da última atualização / Ex: 2022-03-30 16:53:56
}

export interface ICreateStoreAddressRequest {
  store_id: string; // ID da loja (UUID)
  postal_code: string;   // Código Postal - CEP / Ex: 01010010
  address: string;       // Endereço | Logradouro / Ex: Av. Teste
  number: string;        // Número / Ex: 123
  complement: string;    // Complemento / Ex: Casa - Apto - ABC
  city: string;          // Cidade / Ex: São Paulo
  state: string;         // Estado / Ex: São Paulo
}

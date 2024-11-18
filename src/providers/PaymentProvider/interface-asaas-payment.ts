export interface AsaasPaymentWallet {
  userId: string
  walletId: string // Identificador da carteira Asaas que será transferido o valor da cobrança
  fixedValue?: number | null // Valor fixo a ser transferido para a conta quando a cobrança for recebida
  percentualValue?: number | null // Percentual sobre o valor líquido da cobrança a ser transferido quando for recebida
  totalFixedValue?: number | null // (Somente parcelamentos). Valor que será feito split referente ao valor total que será parcelado.
}
export interface IChargeData {
  id?: string
  customer: string
  billingType: string
  value: number
  dueDate: string
  installmentCount?: number | null
  installmentValue?: number | null
  installment?: string
  description?: string
  // externalReference: string
  creditCardToken?: string
  split?:AsaasPaymentWallet []
  creditCard?: {
    holderName?: string
    number?: string
    expiryMonth?: string
    expiryYear?: string
    ccv: string
  }
  creditCardHolderInfo?: {
    name: string
    email: string
    cpfCnpj: string
    postalCode: string
    addressNumber: string
    addressComplement: string
    phone: string
  }
  discount?: {
    value: number
    dueDateLimitDays: number
    type: string
  }
  fine?: {
    value: number
    type: string
  }
  interest?: {
    value: number
    type: string
  }
  remoteIp: string
}

export interface ICustomerData {
  id?: string
  name: string
  email: string
  cpfCnpj: string
  phone?: string
}

export interface IRefundPayment{
  idPayment: string, 
  value: number, 
  description: string
}

export interface IBankAccount{
  bankName: string
  agency: string
  account: string
  accountType: string
  accountDigit: string
}

export interface IWebhook {
  name: string;                  // Nome do Webhook
  url: string;                   // URL que receberá as informações de sincronização
  email: string;                 // Email para receber notificações em caso de erros na fila
  sendType: 'SEQUENTIALLY' | 'NON_SEQUENTIALLY'; // Tipo de envio (sequencial ou não)
  apiVersion?: number;           // Versão utilizada da API (padrão é 3)
  enabled: boolean;              // Habilitar ou não o webhook
  interrupted?: boolean;         // Situação da fila de sincronização
  authToken?: string;            // Token de autenticação
  events: string[];              // Lista de eventos observados pelo webhook
}

export interface ICreateSubAccountToSplitPayment {
  name: string;                  // Nome da subconta
  email: string;                 // Email da subconta
  loginEmail?: string;           // Email para login (opcional, pode ser o mesmo do email da subconta)
  cpfCnpj: string;               // CPF ou CNPJ do proprietário da subconta
  birthDate?: Date;              // Data de nascimento (somente quando pessoa física)
  companyType?: string;          // Tipo de empresa (somente quando pessoa jurídica)
  phone?: string;                // Telefone fixo
  mobilePhone: string;           // Telefone celular (obrigatório)
  site?: string;                 // URL referente ao site da conta filha
  incomeValue: number;           // Faturamento/Renda mensal
  address: string;               // Logradouro (endereço)
  addressNumber: string;         // Número do endereço
  complement?: string;           // Complemento do endereço
  province: string;              // Bairro
  postalCode: string;            // CEP do endereço
  webhooks: IWebhook[];         // Array de Webhooks (opcional)
}

export interface IResponseCreateSubAccountToSplitPayment {
  object: string; // Tipo do objeto, neste caso "account"
  id: string; // ID da subconta
  name: string; // Nome da subconta
  email: string; // Email da subconta
  loginEmail: string; // Email de login da subconta
  phone: string | null; // Telefone fixo (pode ser vazio ou nulo)
  mobilePhone: string | null; // Telefone celular (pode ser vazio ou nulo)
  address: string; // Logradouro
  addressNumber: string; // Número do endereço
  complement?: string | null; // Complemento do endereço, opcional ou nulo
  province: string; // Bairro
  postalCode: string; // CEP do endereço
  cpfCnpj: string; // CPF ou CNPJ do proprietário
  birthDate?: Date | null; // Data de nascimento (somente para Pessoa Física, opcional ou nulo)
  personType: string; // Tipo de pessoa ("JURIDICA" ou "FISICA")
  companyType?: string; // Tipo da empresa (somente para Pessoa Jurídica, opcional)
  city: number; // ID da cidade
  state: string; // Estado (sigla)
  country: string; // País
  tradingName?: string | null; // Nome fantasia (opcional ou nulo)
  site?: string | null; // URL do site (opcional ou nulo)
  incomeRange?: string; // Faixa de faturamento
  incomeValue: number; // Faturamento/Renda mensal
  apiKey: string; // Chave da API
  walletId: string; // ID da carteira
  accountNumber: {
    agency: string; // Agência bancária
    account: string; // Número da conta bancária
    accountDigit: string; // Dígito da conta bancária
  };
}

export interface IResponseDeletedPayment{
  deleted: boolean;
  id: string;
}

export interface IAsaasProvider {
  createPayment(data: IChargeData): Promise<any | undefined>
  createCustomer(data: ICustomerData): Promise<ICustomerData | undefined>
  findUniqueInstallments(idInstallment: string): Promise<any | null>
  refundPayment(data: IRefundPayment): Promise<any | undefined>
  createSubAccountToSplitPayment(accountUser: ICreateSubAccountToSplitPayment): Promise<IResponseCreateSubAccountToSplitPayment | undefined>
  cancelPayment(idAsaasPayment: string): Promise<IResponseDeletedPayment | undefined>
}

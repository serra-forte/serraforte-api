import axios, { AxiosError } from 'axios'
import {
  ICustomerResponse,
  IAsaasProvider,
  IChargeData,
  ICreateSubAccountToSplitPayment,
  ICustomerData,
  IRefundPayment,
} from '../interface-asaas-payment'
import 'dotenv/config'
import { IAsaasPayment } from '@/dtos/asaas-payment.dto'

export class AsaasProvider implements IAsaasProvider {
  async updateCustomer(data: ICustomerData): Promise<ICustomerResponse | null> {
    try {
      const responseUpdateCustomer = await axios
        .put(`${process.env.ASAAS_API_URL}/customers/${data.id}`, data, {
          headers: {
            'Content-Type': 'application/json',
            access_token: `${process.env.ASAAS_API_KEY}`,
          },
        })
        .then((response) => {
          return response.data
        })
      return responseUpdateCustomer
    } catch (error) {
       if(error instanceof AxiosError && error.response?.status === 404){
        return null
      }
      
      throw error
    }
  }

  async getCustomer(customerId: string): Promise<ICustomerResponse | null> {
    try{
      const responseCustomer = await axios
        .get(`${process.env.ASAAS_API_URL}/customers/${customerId}`, {
          headers: {
            'Content-Type': 'application/json',
            access_token: `${process.env.ASAAS_API_KEY}`,
          },
        })
        .then((response) => {
          if(response.status === 404){
            return null
          }
          return response.data
        })
      return responseCustomer
    } catch (error) {

      if(error instanceof AxiosError && error.response?.status === 404){
        return null
      }
      
      throw error
    }
  }
  
  async cancelPayment(idAsaasPayment: string){
    try {
      const responseDeletePayment = await axios
        .delete(`${process.env.ASAAS_API_URL}/payments/${idAsaasPayment}`, {
          headers: {
            'Content-Type': 'application/json',
            access_token: `${process.env.ASAAS_API_KEY}`,
          },
        })
        .then((response) => {
          return response.data
        })
      return responseDeletePayment
    } catch (error) {
      console.log(error)
      return undefined
    }
  }

  async createSubAccountToSplitPayment({
    address,
    addressNumber,
    birthDate,
    companyType,
    cpfCnpj,
    email,
    incomeValue,
    mobilePhone,
    name,
    postalCode,
    province,
    site,
    complement,
    loginEmail,
    phone
  }: ICreateSubAccountToSplitPayment){
    try {
      const responseCreateSubAccount = await axios
        .post(
          `${process.env.ASAAS_API_URL}/accounts`,
          {
            name,
            email,
            loginEmail,
            cpfCnpj,
            birthDate,
            companyType,
            phone,
            mobilePhone,
            site,
            incomeValue,
            address,
            addressNumber,
            complement,
            province,
            postalCode,

          },
          {
            headers: {
              'Content-Type': 'application/json',
              access_token: `${process.env.ASAAS_API_KEY}`,
            },
          },
        )
        .then((response) => {
          return response.data
        })
      return responseCreateSubAccount
    } catch (error) {
      console.log(error)
      return undefined
    }
  }

  async refundPayment({
    idPayment,
    value,
    description,
  }: IRefundPayment): Promise<any> {
    try {
      const responseRefundPayment = await axios
        .post(
          `${process.env.ASAAS_API_URL}/payments/${idPayment}/refund`,
          {
            value,
            description,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              access_token: `${process.env.ASAAS_API_KEY}`,
            },
          },
        )
        .then((response) => {
          return response.data
        })
      return responseRefundPayment
    } catch (error) {
      console.log(error)
      return undefined
    }
  }

  async findUniqueInstallments(idInstallment: string) {
    try {
      const responseFindInstallments = await axios
        .get(`${process.env.ASAAS_API_URL}/installments/${idInstallment}`, {
          headers: {
            'Content-Type': 'application/json',
            access_token: `${process.env.ASAAS_API_KEY}`,
          },
        })
        .then((response) => {
          return response.data
        })

      return responseFindInstallments
    } catch (error) {
      console.log('Error find Unique Installments in ASAAS', error)

      return undefined
    }
  }

  async createPayment(data: IChargeData) {
    try {
      const responseCreatePayment = await axios
        .post(`${process.env.ASAAS_API_URL}/payments`, data, {
          headers: {
            'Content-Type': 'application/json',
            access_token: `${process.env.ASAAS_API_KEY}`,
          },
        })
        .then((response) => {
          return response.data as IAsaasPayment
        })
      return responseCreatePayment
    } catch (error) {
      if(error instanceof AxiosError && error.response?.status){
        return null
      }
      
      throw error
    }
  }

  async createCustomer(data: ICustomerData) {
    try {
      const responseCreateCustomer = await axios
        .post(`${process.env.ASAAS_API_URL}/customers`, data, {
          headers: {
            'Content-Type': 'application/json',
            access_token: `${process.env.ASAAS_API_KEY}`,
          },
        })
        .then((response) => {
          if(response.status === 404){
            return null
          }
          return response.data
        })
      return responseCreateCustomer
    } catch (error) {
      
      if(error instanceof AxiosError && error.response?.status){
        return null
      }
      
      throw error
    }
  }
}

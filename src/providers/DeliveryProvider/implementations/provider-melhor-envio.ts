import { env } from '@/env';
import axios, { AxiosError } from 'axios';
import { IMelhorEnvioProvider, IPurchaseResponse, IRequestCalculateShipping, IRequestSendFreightToCart, IResponseAuth, IResponseCalculateShipping, IResponseGenerateLabel, IResponseGenerateLabelLinkToPrinting, IResponseSendFreightToCart, ITrackingResponse } from './../interface-melhor-envio-provider';
import { IRailwayProvider } from '@/providers/RailwayProvider/interface-railway-provider';
import "dotenv/config"
import { IMailProvider } from '@/providers/MailProvider/interface-mail-provider';
import { IUsersRepository } from '@/repositories/interfaces/interface-users-repository';
import { ICreateStoreRequest } from '../interfaces/request/create-store-request';
import { ICreateStoreResponse } from '../interfaces/response/create-store-response';
import { ICreateStoreAddressRequest } from '../interfaces/request/create-store-address-request';
import { INVALID_EMAIL } from '../error/error-codes';
import { AppError } from '@/usecases/errors/app-error';

export class MelhorEnvioProvider implements IMelhorEnvioProvider {
  private accessToken: string | null = null;
  
  constructor(
    private railwayProvider: IRailwayProvider, 
    private mailProvider: IMailProvider,
    private usersRepository: IUsersRepository
  ) {}
 
  async createStoreAddress(data: ICreateStoreAddressRequest): Promise<boolean> {
    try{
      const response = await axios.post(`${env.MELHOR_ENVIO_API_URL}/api/v2/me/companies/${data.store_id}/addresses`, data, {
        headers: {
          'Authorization': `Bearer ${process.env.MELHOR_ENVIO_ACCESS_TOKEN}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json', 
          'User-Agent': 'Serra Forte/kaiomoreira.dev@gmail.com',
        },
      });

      if (response.status === 200) {
        return true
      }else{
        return false
      }
    }catch(error: any){
      // * Renovar o token caso seja o problema de token expirado
      if (error instanceof AxiosError && error.response?.status === 401) {
        console.log('Token expirado, renovando...');
        // Tenta renovar o tokenn
        try {
          const response = await this.refreshToken();
          console.log('Token renovado com sucesso');

          if(response.access_token){
            // Após renovar o token, tenta novamente calcular o frete
            return this.createStoreAddress(data);
          }
        } catch (refreshError) {
          console.error('Erro ao renovar o token:', refreshError);
          // throw refreshError;
        }
      }
      throw error;
    }
  }
  async createStore(data: ICreateStoreRequest): Promise<ICreateStoreResponse | AppError> {
    try{
      const response = await axios.post(`${env.MELHOR_ENVIO_API_URL}/api/v2/me/companies`, data, {
        headers: {
          'Authorization': `Bearer ${process.env.MELHOR_ENVIO_ACCESS_TOKEN}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json', 
          'User-Agent': 'Serra Forte/kaiomoreira.dev@gmail.com',
        },
      });

      if (response.status === 200) {
        return response.data;
      }else{
        return response.data;
      }
    }catch(error: any){
      if (error instanceof AxiosError && error.response?.status === 401) {
        console.log('Token expirado, renovando...');
        // Tenta renovar o tokenn
        try {
          const response = await this.refreshToken();
          console.log('Token renovado com sucesso');

          if(response.access_token){
            // Após renovar o token, tenta novamente calcular o frete
            return this.createStore(data);
          }
        } catch (refreshError) {
          console.error('Erro ao renovar o token:', refreshError);
          // throw refreshError;
        }
      }else if (error instanceof AxiosError && error.response?.status === 422){
        return new AppError(INVALID_EMAIL, 422);
      }
      throw new AppError(error.response.data.message, error.response.status);
    }
  }
  async generateLabelLinkToPrinting(orderId: string): Promise<IResponseGenerateLabelLinkToPrinting | null> {
    try {
      const response = await axios.post(`${env.MELHOR_ENVIO_API_URL}/api/v2/me/shipment/print`, {
        orders: [orderId],
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.MELHOR_ENVIO_ACCESS_TOKEN}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json', 
          'User-Agent': 'Serra Forte/kaiomoreira.dev@gmail.com',
        },
      });

      if (response.status === 200) {
        return response.data;
      }else{
        return null
      }
    } catch (error: any) {
      console.warn(JSON.stringify(error.response.data, null, 2))
      // * Renovar o token caso seja o problema de token expirado
      if (error instanceof AxiosError && error.response?.status === 401) {
        console.log('Token expirado, renovando...');
        // Tenta renovar o tokenn
        try {
          const response = await this.refreshToken();
          console.log('Token renovado com sucesso');

          if(response.access_token){
            // Após renovar o token, tenta novamente calcular o frete
            return this.generateLabelLinkToPrinting(orderId);
          }
        } catch (refreshError) {
          console.error('Erro ao renovar o token:', refreshError);
          // throw refreshError;
        }
      }
      throw error;
    }
  }
  async generateLabel(orderId: string): Promise<IResponseGenerateLabel | null> {
    try {
      const response = await axios.post(`${env.MELHOR_ENVIO_API_URL}/api/v2/me/shipment/generate`, {
        orders: [orderId],
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.MELHOR_ENVIO_ACCESS_TOKEN}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json', 
          'User-Agent': 'Serra Forte/kaiomoreira.dev@gmail.com',
        },
      });

      if (response.status === 200) {
        return response.data;
      }else{
        return null
      }
    } catch (error: any) {
      // * Renovar o token caso seja o problema de token expirado
      if (error instanceof AxiosError && error.response?.status === 401) {
        console.log('Token expirado, renovando...');
        // Tenta renovar o tokenn
        try {
          const response = await this.refreshToken();
          console.log('Token renovado com sucesso');

          if(response.access_token){
            // Após renovar o token, tenta novamente calcular o frete
            return this.generateLabel(orderId);
          }
        } catch (refreshError) {
          console.error('Erro ao renovar o token:', refreshError);
          // throw refreshError;
        }
      }
      throw error;
    }
  }
  async paymentToFreight(orderId: string): Promise<IPurchaseResponse | null> {
    try {
      const response = await axios.post(`${env.MELHOR_ENVIO_API_URL}/api/v2/me/shipment/checkout`, {
        orders: [orderId],
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.MELHOR_ENVIO_ACCESS_TOKEN}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json', 
          'User-Agent': 'Serra Forte/kaiomoreira.dev@gmail.com',
        },
      });

      if (response.status === 200) {
        return response.data;
      }else{
        return null
      }
    } catch (error: any) {
      // * Renovar o token caso seja o problema de token expirado
      if (error instanceof AxiosError && error.response?.status === 401) {
        console.log('Token expirado, renovando...');
        // Tenta renovar o tokenn
        try {
          const response = await this.refreshToken();
          console.log('Token renovado com sucesso');

          if(response.access_token){
            // Após renovar o token, tenta novamente calcular o frete
            return this.paymentToFreight(orderId);
          }
        } catch (refreshError) {
          console.error('Erro ao renovar o token:', refreshError);
          // throw refreshError;
        }
      }
      throw error;
    }
  }
  async addFreightToCart(data: IRequestSendFreightToCart):Promise<IResponseSendFreightToCart | null> {
    try {
      const response = await axios.post(`${env.MELHOR_ENVIO_API_URL}/api/v2/me/cart`, data, {
        headers: {
          'Authorization': `Bearer ${process.env.MELHOR_ENVIO_ACCESS_TOKEN}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Serra Forte/kaiomoreira.dev@gmail.com',
        },
      })
      if (response.status === 201) {
        return response.data;
      }else{
        return null
      }
    } catch (error: any) {
      console.warn(JSON.stringify(error.response.data, null, 2))
      // * Renovar o token caso seja o problema de token expirado
      if (error instanceof AxiosError && error.response?.status === 401) {
        console.log('Token expirado, renovando...');
        // Tenta renovar o tokenn
        try {
          const response = await this.refreshToken();
          console.log('Token renovado com sucesso');

          if(response.access_token){
            // Após renovar o token, tenta novamente calcular o frete
            return this.addFreightToCart(data);
          }
        } catch (refreshError) {
          console.error('Erro ao renovar o token:', refreshError);
          // throw refreshError;
        }
      }

      throw error;
    }
  }
  async refreshToken(): Promise<IResponseAuth> {
    try {
      const response = await axios.post(`${env.MELHOR_ENVIO_API_URL}/oauth/token`, {
        grant_type: 'refresh_token',
        client_id: env.MELHOR_ENVIO_CLIENT_ID,
        client_secret: env.MELHOR_ENVIO_CLIENT_SECRET,
        refresh_token: process.env.MELHOR_ENVIO_REFRESH_TOKEN,
      });
      
      if (response.status === 200) {
        // Atualizar o refresh token e o access token no Railway
        await this.railwayProvider.variablesUpsert([
          { name: 'MELHOR_ENVIO_REFRESH_TOKEN', value: response.data.refresh_token },
          { name: 'MELHOR_ENVIO_ACCESS_TOKEN', value: response.data.access_token }
        ]);

        this.accessToken = response.data.access_token;
         // Atualizar as variáveis no processo atual
        //  env.MELHOR_ENVIO_REFRESH_TOKEN = response.data.refresh_token;
        //  env.MELHOR_ENVIO_ACCESS_TOKEN = response.data.access_token;

        // Atualizar as variáveis no processo atual
        process.env.MELHOR_ENVIO_REFRESH_TOKEN = response.data.refresh_token;
        process.env.MELHOR_ENVIO_ACCESS_TOKEN = response.data.access_token;
      
        return response.data;
      } else {
        const admins = await this.usersRepository.listAdmins();

        // formatar do painel admin no frontend
        const link =
        env.NODE_ENV === 'development'
          ? `${env.APP_URL_FRONTEND_DEVELOPMENT}/admin-panel/melhor-envio/refresh-token`
          : `${env.APP_URL_FRONTEND_PRODUCTION}/admin-panel/melhor-envio/refresh-token`

        // pegar template de email
        const pathTemplate =
        env.NODE_ENV === 'development'
          ? './views/emails/authenticate-melhor-envio.hbs'
          : './build/views/emails/authenticate-melhor-envio.hbs'

        
        for (const admin of admins) {
          // dispara e-mail avisando o admin que o token expirou
          await this.mailProvider.sendEmail(
            admin.email,
            admin.name,
            'Token de Acesso Expirado - Melhor Envio',
            link,
            pathTemplate,
            null
          )
        }
        throw new Error('Failed to get access token');
      }
    } catch (error) {
      // console.error('Error fetching auth token:', error);;
      throw error;
    }
  }
  async shipmentCalculate(data: IRequestCalculateShipping): Promise<IResponseCalculateShipping[]> {
    try {
      const response = await axios.post(`${env.MELHOR_ENVIO_API_URL}/api/v2/me/shipment/calculate`, data, {
        headers: {
          'Authorization': `Bearer ${process.env.MELHOR_ENVIO_ACCESS_TOKEN}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Serra Forte/kaiomoreira.dev@gmail.com',
        }
      });
     

      if (response.status === 200) {  
        return response.data;
      } else {
        throw new Error('Failed to calculate shipment');
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        console.log('Token expirado, renovando...');
        // Tenta renovar o tokenn
        try {
          const response = await this.refreshToken();
          
          if(response.access_token){
            console.log('Token renovado com sucesso');
            // Após renovar o token, tenta novamente calcular o frete
            return this.shipmentCalculate(data);
          }
        } catch (refreshError) {
          console.error('Erro ao renovar o token:', refreshError);
          // throw refreshError;
        }
      }

      throw error;
    }
  }
  async authorization(code: string): Promise<IResponseAuth> {
    try {
        const response = await axios.post(`${env.MELHOR_ENVIO_API_URL}/oauth/token`,
            {
              grant_type: 'authorization_code',
              state: 'serra-forte',
              code,
              client_id: env.MELHOR_ENVIO_CLIENT_ID,
              redirect_uri: env.MELHOR_REDIRECT_URI,  // Definido ao criar o app.
              client_secret: env.MELHOR_ENVIO_CLIENT_SECRET,
            });
  
        if (response.status === 200) {
          await this.railwayProvider.variablesUpsert([
            { name: 'MELHOR_ENVIO_REFRESH_TOKEN', value: response.data.refresh_token },
            { name: 'MELHOR_ENVIO_ACCESS_TOKEN', value: response.data.access_token }
          ]);

          return response.data;
        } else {
          throw new Error('Failed to get access token');
        }
      } catch (error) {
        console.error('Error fetching auth token:', error);
        throw error;
      }
  }
}



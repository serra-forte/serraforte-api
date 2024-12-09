import { env } from '@/env';
import axios, { AxiosError } from 'axios';
import { IMelhorEnvioProvider, IRequestCalculateShipping, IRequestSendFreightToCart, IResponseAuth, IResponseCalculateShipping } from './../interface-melhor-envio-provider';
import { IRailwayProvider } from '@/providers/RailwayProvider/interface-railway-provider';
import "dotenv/config"
import { IMailProvider } from '@/providers/MailProvider/interface-mail-provider';
import { IUsersRepository } from '@/repositories/interfaces/interface-users-repository';

export class MelhorEnvioProvider implements IMelhorEnvioProvider {
  constructor(
    private railwayProvider: IRailwayProvider, 
    private mailProvider: IMailProvider,
    private usersRepository: IUsersRepository
  ) {}
  async addFreightToCart(data: IRequestSendFreightToCart):Promise<any> {
    try {
      const response = await axios.post(`${env.MELHOR_ENVIO_API_URL}/api/v2/me/cart`, data, {
        headers: {
          'Authorization': `Bearer ${process.env.MELHOR_ENVIO_ACCESS_TOKEN}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Serra Forte/kaiomoreira.dev@gmail.com',
        },
      })
      console.log(response.data)
      if (response.status === 200) {
        return response.data
      }
    } catch (error: any) {
      console.warn(JSON.stringify(error.response.data, null, 2))
      // Tratamento de erro
      throw error;
    }
  }

  async refreshToken(): Promise<IResponseAuth> {
    try {
      const response = await axios.post(`${env.MELHOR_ENVIO_API_URL}/oauth/token`, {
        grant_type: 'refresh_token',
        client_id: env.MELHOR_ENVIO_CLIENT_ID,
        client_secret: env.MELHOR_ENVIO_CLIENT_SECRET,
        refresh_token: env.MELHOR_ENVIO_REFRESH_TOKEN,
      });
      
      if (response.status === 200) {
        // Atualizar o refresh token e o access token no Railway
        await this.railwayProvider.variablesUpsert([
          { name: 'MELHOR_ENVIO_REFRESH_TOKEN', value: response.data.refresh_token },
          { name: 'MELHOR_ENVIO_ACCESS_TOKEN', value: response.data.access_token }
        ]);

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
          console.log('Token renovado com sucesso');

          if(response.access_token){
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



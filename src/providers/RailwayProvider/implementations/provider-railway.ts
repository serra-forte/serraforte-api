import { env } from "@/env";
import { IRailwayProvider, Variables } from "../interface-railway-provider";
import axios from "axios";

export interface variableUpsert{
    projectId: string;
    environmentId: string;
    serviceId: string;
    name: string;
    value: string;
}
export class RailwayProvider implements IRailwayProvider {
    async variablesUpsert(variables: Variables[]) {
        try {
            const query = `
            mutation variableUpsert($input: VariableUpsertInput!) {
                variableUpsert(input: $input)
            }
            `;

            // Loop para enviar uma requisição por variável
            for (const variable of variables) {
                const variableToUpsert = {
                    projectId: env.RAILWAY_PROJECT_ID,
                    environmentId: env.RAILWAY_ENVIRONMENT_ID,
                    serviceId: env.RAILWAY_SERVICE_ID,
                    name: variable.name,
                    value: variable.value
                };

                const response = await axios.post(env.RAILWAY_API_URL,
                    {
                        query,
                        variables: {
                            input: variableToUpsert
                        },
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${env.RAILWAY_TOKEN}`
                        }
                    }
                );

                if (response.data.errors) {
                    console.error('Erro ao atualizar a variável:', response.data.errors.message);
                } else {
                    console.log('Variável de ambiente atualizada com sucesso:', response.data.data);
                }
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    }
}

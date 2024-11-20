import { env } from "@/env";
import { IRailwayProvider, ResponseUpsertVariables, Variables } from "../interface-railway-provider";
import axios from "axios";

export interface variableUpsert{
    projectId: string;
    environmentId: string;
    serviceId: string;
    name: string;
    value: string;
}
export class RailwayProvider implements IRailwayProvider {
    async variablesUpsert(variables: Variables[]): Promise<ResponseUpsertVariables> {
        const result: ResponseUpsertVariables = { variableUpsert: [] };

        try {
            const query = `
            mutation variableUpsert($input: VariableUpsertInput!) {
                variableUpsert(input: $input)
            }
            `;

            for (const variable of variables) {
                const variableToUpsert = {
                    projectId: env.RAILWAY_PROJECT_ID,
                    environmentId: env.RAILWAY_ENVIRONMENT_ID,
                    serviceId: env.RAILWAY_SERVICE_ID,
                    name: variable.name,
                    value: variable.value,
                };

                try {
                    const response = await axios.post(
                        env.RAILWAY_API_URL,
                        {
                            query,
                            variables: {
                                input: variableToUpsert,
                            },
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${env.RAILWAY_TOKEN}`,
                            }
                        }
                    );

                    if (response.data.errors) {
                        const errorMessage = response.data.errors.map((err: any) => err.message).join(", ");
                        console.error('Erro ao atualizar a variável:', errorMessage);
                        result.variableUpsert.push(false); // Indique que a operação falhou
                    } else if (response.data.data?.variableUpsert) {
                        console.log('Variável de ambiente atualizada com sucesso:', variable.name);
                        result.variableUpsert.push(true); // Sucesso
                    } else {
                        console.error('Resposta inesperada do servidor:', response.data);
                        result.variableUpsert.push(false); // Falha
                    }
                } catch (error) {
                    console.error(`Erro ao processar a variável ${variable.name}:`, error);
                    result.variableUpsert.push(false); // Falha devido a erro na requisição
                }
            }
        } catch (error) {
            console.error('Erro geral na execução:', error);
        }

        return result; // Sempre retorna o resultado
    }
}


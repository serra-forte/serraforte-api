export interface Variables {
    name: string
    value: string
}

export interface ResponseUpsertVariables {
    variableUpsert: boolean[]
}
export interface IRailwayProvider {
    variablesUpsert(variables: Variables[]): Promise<ResponseUpsertVariables>
}
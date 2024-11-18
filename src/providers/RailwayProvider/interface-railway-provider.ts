export interface Variables {
    name: string
    value: string
}
export interface IRailwayProvider {
    variablesUpsert(variables: Variables[]): Promise<void>
}
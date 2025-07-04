export interface INodeCronProvider {
    checkPaymentAfter24Hours(): Promise<void>
    updateProducts(): Promise<void>
    startSystemUpdating(): Promise<void>
}

export interface INodeCronProvider {
    checkPaymentAfter24Hours(): Promise<void>
    sendLabelToCart(): Promise<void>
    labelPaymentProcess(): Promise<void>
    printingLabelGenerate(): Promise<void>
}

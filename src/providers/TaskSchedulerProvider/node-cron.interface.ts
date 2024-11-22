export interface INodeCronProvider {
    checkPaymentAfter24Hours(): Promise<void>
    labelPaymentProcess(): Promise<void>
    printingLabelGenerate(): Promise<void>
}

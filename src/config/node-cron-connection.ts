import { NodeCronProvider } from './../providers/TaskSchedulerProvider/Implementations/node-cron.provider';

export async function connectionNodeCron() {
    try {
        const nodeCronProvider = new NodeCronProvider()
  
        nodeCronProvider.checkPaymentAfter24Hours()

        console.log("Connected to NodeCron")
    } catch (error) {
        console.log("Not connected to NodeCron")
    }
}
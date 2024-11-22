import { env } from "./env";
import { fastifyApp } from "./app";
import { connectionNodeCron } from "./config/node-cron-connection";
import "./providers/QueueProvider/kafka/consumers/index";

connectionNodeCron();

fastifyApp.listen({
    host: env.HOST,
    port: env.PORT,
    }, ()=>{
    console.log(`Server Running on host: ${env.HOST} port: ${env.PORT}`)
})
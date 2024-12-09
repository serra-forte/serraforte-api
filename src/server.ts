import { env } from "./env";
import { fastifyApp } from "./app";
import { connectionNodeCron } from "./config/node-cron-connection";
import "./providers/QueueProvider/kafka/consumers/index";
import { ConsumerManager } from "./providers/QueueProvider/kafka/consumers/index";

const consumers = new ConsumerManager();
consumers.startAll();

connectionNodeCron();

fastifyApp.listen({
    host: env.HOST,
    port: env.PORT,
    }, ()=>{
    console.log(`Server Running on host: ${env.HOST} port: ${env.PORT}`)
})
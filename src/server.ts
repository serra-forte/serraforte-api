import { env } from "./env";
import { fastifyApp } from "./app";
import { connectionNodeCron } from "./config/node-cron-connection";
import { producer } from "./usecases/deliveries/kafka";

connectionNodeCron();
producer.connect().then(() => {
    console.log("Kafka producer connected");
})

fastifyApp.listen({
    host: env.HOST,
    port: env.PORT,
    }, ()=>{
    console.log(`Server Running on host: ${env.HOST} port: ${env.PORT}`)
})
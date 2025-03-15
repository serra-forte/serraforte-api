import { Admin } from "kafkajs";
import { kafka } from ".";

export class KafkaAdmin{
    admin: Admin
    constructor(){
        this.admin = kafka.admin()
    }

    async connect() {
        await this.admin.connect();
      }
    
      async disconnect() {
        await this.admin.disconnect();
      }
    
      async createTopics(topic: string) {
        await this.admin.createTopics({ 
            topics: [
                {
                topic,
                numPartitions: 5,
                replicationFactor: 1
            }]
         });
        console.log('Tópicos criados com sucesso!');
      }
}
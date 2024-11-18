import { env } from "@/env";
import { IFileProvider } from "../file-provider.interface";
import fs from 'fs'
import "dotenv/config"

export class FileTMPProvider implements IFileProvider{
    deleteFileTmp(fileName: string, folderPath: string){
        try {
            // verifica qual pasta é em produção ou em dev pois pode ser src ou build
            let path = env.NODE_ENV === 'development' ? env.FOLDER_TMP_DEVELOPMENT : env.FOLDER_TMP_PRODUCTION

            if(env.NODE_ENV === 'test'){
                path = env.FOLDER_TMP_DEVELOPMENT
            }

            // Verifique se o arquivo existe antes de tentar excluí-lo
            if (!fs.existsSync(`${path}/${folderPath}/${fileName}`)) {
                return
            }

            // Exclua o arquivo
            fs.unlinkSync(`${path}/${folderPath}/${fileName}`);
        } catch (error) {
            throw error
        }
    }
}
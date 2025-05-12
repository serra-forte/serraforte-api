import { IStorageProvider } from '../storage-provider.interface';
import 'dotenv/config';
import {firebaseApp} from '@/config/firebase-connection';
import { Bucket } from '@google-cloud/storage';
import { AppError } from '@/usecases/errors/app-error';

export class FirebaseStorageProvider implements IStorageProvider {
    private readonly storage: Bucket;

    constructor() {
        this.storage = firebaseApp.storage().bucket() as unknown as Bucket;
    }

    async deleteFile(fileName: string, folderStorage: string){
        try {
            if(!fileName){
               return
            }

            await this.storage.file(`${folderStorage}/${fileName}`).delete()

        } catch (error) {
            console.log('Error ao deletar a imagem');
        }
    }

    async uploadFile(fileName: string, pathFolder: string, folderStorage: string){
        try {
            const destination = `${folderStorage}/${fileName}`;
            const filePath = `${pathFolder}/${fileName}`;

            const uploadImage = await this.storage.upload(filePath, {
                destination,
            });

            if(!uploadImage){
                throw new AppError('Error ao fazer upload da imagem', 400);
            }
          
            const fileNameUploaded = uploadImage[0].metadata.name as string;
            const file = this.storage.file(fileNameUploaded);
            const fileRef = await file.getSignedUrl({
                action: 'read',
                expires: '03-09-2491',
            })
            
            const URL = fileRef[0];
            return URL
    
        } catch (error) {
            console.log('Error ao fazer upload da imagem');
        }
    }
}

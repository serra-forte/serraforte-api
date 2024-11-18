import { FirebaseStorageProvider } from "@/providers/StorageProvider/implementations/firebase-storage.provider";

async function run() {
    const storageProvider = new FirebaseStorageProvider()

    await storageProvider.uploadFile('nestjs.png', './src/tmp/campings', 'campings')
    
    await storageProvider.deleteFile('nestjs.png', 'campings')
}
run();
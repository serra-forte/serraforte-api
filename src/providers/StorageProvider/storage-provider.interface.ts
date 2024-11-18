export interface IStorageProvider {
    uploadFile(fileName: string, pathFolder: string, folderStorage: 'products' | 'users'): Promise<string | undefined>;
    deleteFile(fileName: string, folderStorage: 'products' | 'users'): Promise<void>
}

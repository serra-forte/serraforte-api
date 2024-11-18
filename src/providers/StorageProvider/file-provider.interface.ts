export interface IFileProvider {
    deleteFileTmp(fileName: string, folderPath: 'products' | 'users'): void
}
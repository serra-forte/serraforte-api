export class ResourceNotFoundError extends Error {
  public statusCode: number;

  constructor(resource = 'Recurso não encontrado') {
    super(resource);
    this.name = 'ResourceNotFoundError';
    this.statusCode = 404;

    // Garante que o stack trace funcione corretamente
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ResourceNotFoundError);
    }
  }
}

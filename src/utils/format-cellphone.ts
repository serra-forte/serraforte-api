export function formatPhoneNumber(phone: string) {
  if (!phone || typeof phone !== 'string') return phone;

  // Remove qualquer caractere que não seja número
  const cleaned = phone.replace(/\D/g, '');

  // Verifica se tem 11 dígitos (2 DDD + 9 do celular)
  if (cleaned.length !== 11) return phone;

  const ddd = cleaned.slice(0, 2);
  const firstPart = cleaned.slice(2, 7);
  const secondPart = cleaned.slice(7, 11);

  return `(${ddd}) ${firstPart}-${secondPart}`;
}

export function hasAccent(str: string): boolean {
  // Expressão regular para verificar se a string contém caracteres acentuados
  const accentRegex = /[\u00C0-\u00FF]/;
  return accentRegex.test(str);
}

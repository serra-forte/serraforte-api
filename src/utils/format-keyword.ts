import fetch from 'node-fetch';

// Função para corrigir o acento de uma palavra usando a API do LanguageTool
async function formatKeyword(palavra: string): Promise<string> {
  const response = await fetch('https://api.languagetool.org/v2/check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      text: palavra,
      language: 'pt-BR'
    })
  });

  const result = await response.json();
  if (result.matches.length > 0) {
    // Extrai a primeira sugestão de correção, se houver
    const sugestao = result.matches[0]?.replacements[0]?.value;
    return sugestao || palavra;
  }

  return palavra;
}

// Exporta a função para uso em outros arquivos
export default formatKeyword;

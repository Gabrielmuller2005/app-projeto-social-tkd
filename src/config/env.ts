// Único ponto de leitura de variáveis de ambiente do app.
// Nenhum outro arquivo deve ler process.env diretamente.

const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error(
    'EXPO_PUBLIC_API_URL não definida. Crie um arquivo .env na raiz do projeto (veja .env.example).'
  );
}

export const env = {
  API_URL,
};

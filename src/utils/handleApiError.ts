import { AxiosError } from 'axios';

const FALLBACK_MESSAGE = 'Não foi possível completar a operação. Tente novamente.';
const TIMEOUT_MESSAGE = 'O servidor está demorando para responder. Tente novamente em instantes.';
const NETWORK_MESSAGE = 'Não foi possível conectar ao servidor. Verifique sua conexão.';

// Extrai uma mensagem amigável de qualquer erro vindo da API.
// A API sempre responde erros no formato { message: "..." } — nunca exibir stack/JSON cru ao usuário.
export function getApiErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.code === 'ECONNABORTED') return TIMEOUT_MESSAGE;
    if (!error.response) return NETWORK_MESSAGE;

    const data = error.response.data as { message?: string } | undefined;
    return data?.message || FALLBACK_MESSAGE;
  }

  return FALLBACK_MESSAGE;
}

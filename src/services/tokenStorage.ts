import * as SecureStore from 'expo-secure-store';

// Token de autenticação nunca deve ir para AsyncStorage (texto puro, sem criptografia).
const TOKEN_KEY = 'auth_token';

export const saveToken = (token: string): Promise<void> => SecureStore.setItemAsync(TOKEN_KEY, token);

export const getToken = (): Promise<string | null> => SecureStore.getItemAsync(TOKEN_KEY);

export const clearToken = (): Promise<void> => SecureStore.deleteItemAsync(TOKEN_KEY);

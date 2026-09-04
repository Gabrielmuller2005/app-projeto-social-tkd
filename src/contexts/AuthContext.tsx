import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { AuthUser, RegisterGuardianInput, RegisterStudentInput } from '../models';
import { api, setUnauthorizedHandler } from '../services/api';
import { clearToken, getToken, saveToken } from '../services/tokenStorage';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login(telefone: string, senha: string): Promise<void>;
  logout(): Promise<void>;
  registerGuardian(input: RegisterGuardianInput): Promise<void>;
  registerStudent(input: RegisterStudentInput): Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Ao abrir o app: se houver token salvo, valida com /auth/me antes de decidir a navegação.
  // Enquanto isso não resolve, isLoading fica true (nunca mostrar login "piscando" antes da checagem).
  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const me = await api.auth.me();
        setUser(me);
      } catch {
        await clearToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Reage a um 401 vindo de qualquer chamada (sessão expirada) limpando o usuário logado.
  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null));
    return () => setUnauthorizedHandler(null);
  }, []);

  const login = async (telefone: string, senha: string) => {
    const session = await api.auth.loginReal({ telefone, senha });
    await saveToken(session.token);
    setUser(session.user);
  };

  const logout = async () => {
    await clearToken();
    setUser(null);
  };

  // Nenhum dos dois cadastros abaixo devolve token (confirmado em teste real contra a API) —
  // por isso chamam login() com as mesmas credenciais logo após criar a conta.
  const registerGuardian = async (input: RegisterGuardianInput) => {
    await api.auth.registerGuardian(input);
    await login(input.telefone, input.senha);
  };

  const registerStudent = async (input: RegisterStudentInput) => {
    const response = await api.auth.registerStudent(input);
    if (response.user && input.telefone && input.senha) {
      // Autocadastro de aluno maior sem responsável logado: completa o login com os
      // dados recém-cadastrados (ver Bloco 6 da integração).
      await login(input.telefone, input.senha);
    }
    // Cadastro de aluno menor por um responsável já logado (response.aluno): sem conta/login
    // próprios, a sessão atual do responsável permanece intacta.
  };

  const value = useMemo(
    () => ({ user, isLoading, login, logout, registerGuardian, registerStudent }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider.');
  return context;
}

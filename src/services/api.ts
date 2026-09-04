import axios from 'axios';
import type {
  AttendanceRecord,
  AuthLoginInput,
  AuthSession,
  AuthSessionResponse,
  AuthUser,
  AuthUserResponse,
  Belt,
  ClassGroup,
  Graduation,
  Guardian,
  Lesson,
  LoginInput,
  Notice,
  RegisterGuardianInput,
  RegisterStudentInput,
  RegisterStudentResponse,
  Student,
  StudyMaterial,
} from '../models';
import { env } from '../config/env';
import { clearToken, getToken } from './tokenStorage';

export interface AppApi {
  auth: {
    login(input: LoginInput): Promise<AuthSession>;
    requestPasswordReset(phone: string): Promise<void>;
    logout(): Promise<void>;
    // Implementação real conectada às rotas /auth/* já em produção — ver métodos abaixo de `api`.
    loginReal(input: AuthLoginInput): Promise<AuthSessionResponse>;
    me(): Promise<AuthUser>;
    // Nenhum dos dois registros abaixo retorna token (confirmado em teste real) — o AuthContext
    // chama login() com as mesmas credenciais logo em seguida para abrir a sessão.
    registerGuardian(input: RegisterGuardianInput): Promise<AuthUserResponse>;
    registerStudent(input: RegisterStudentInput): Promise<RegisterStudentResponse>;
  };
  students: CrudService<Student>;
  guardians: CrudService<Guardian>;
  classes: CrudService<ClassGroup>;
  lessons: CrudService<Lesson>;
  belts: CrudService<Belt>;
  notices: CrudService<Notice>;
  materials: CrudService<StudyMaterial> & {
    upload(file: UploadInput): Promise<StudyMaterial>;
  };
  attendance: {
    listByLesson(lessonId: string): Promise<AttendanceRecord[]>;
    saveMany(records: AttendanceRecord[]): Promise<void>;
    summary(studentId: string): Promise<AttendanceSummary>;
  };
  graduations: {
    listByStudent(studentId: string): Promise<Graduation[]>;
    create(input: Omit<Graduation, 'id'>): Promise<Graduation>;
  };
};

export interface CrudService<T extends { id: string }> {
  list(): Promise<T[]>;
  get(id: string): Promise<T>;
  create(input: Omit<T, 'id'>): Promise<T>;
  update(id: string, input: Partial<Omit<T, 'id'>>): Promise<T>;
  remove(id: string): Promise<void>;
}

export interface UploadInput {
  uri: string;
  name: string;
  mimeType: string;
  title: string;
  description?: string;
}

export interface AttendanceSummary {
  lessons: number;
  presences: number;
  absences: number;
  percentage: number;
}

export class ApiNotConfiguredError extends Error {
  constructor() {
    super('Conecte uma implementação de AppApi ao backend antes de chamar este método.');
  }
}

const notConfigured = async (): Promise<never> => { throw new ApiNotConfiguredError(); };
const crud = <T extends { id: string }>(): CrudService<T> => ({
  list: notConfigured,
  get: notConfigured,
  create: notConfigured,
  update: notConfigured,
  remove: notConfigured,
});

export const httpClient = axios.create({
  baseURL: env.API_URL,
  // Timeout generoso: o plano free do Render "dorme" a API e o cold start pode levar
  // até ~60s na primeira chamada do dia. Um timeout curto derrubaria essa primeira request.
  timeout: 60_000,
});

httpClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Registrado pelo AuthContext para reagir a uma sessão expirada (401) em qualquer chamada.
let onUnauthorized: (() => void) | null = null;
export const setUnauthorizedHandler = (handler: (() => void) | null): void => {
  onUnauthorized = handler;
};

// /auth/register/aluno fica de fora desta lista: para aluno menor de idade a rota exige
// JWT de um responsável, então um 401 ali é sessão expirada de verdade (deve deslogar).
const AUTH_ENDPOINTS_WITHOUT_SESSION = ['/auth/login', '/auth/register/responsavel'];

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const url = error.config?.url ?? '';
    const isAuthEndpointWithoutSession = AUTH_ENDPOINTS_WITHOUT_SESSION.some((endpoint) => url.includes(endpoint));
    if (error.response?.status === 401 && !isAuthEndpointWithoutSession) {
      await clearToken();
      onUnauthorized?.();
    }
    return Promise.reject(error);
  }
);

// Substitua os métodos ainda com `notConfigured` conforme as rotas forem implementadas no backend.
export const api: AppApi = {
  auth: {
    login: notConfigured,
    requestPasswordReset: notConfigured,
    logout: notConfigured,
    loginReal: async (input) => (await httpClient.post<AuthSessionResponse>('/auth/login', input)).data,
    // GET /auth/me devolve { user }, não o usuário direto (confirmado em teste real).
    me: async () => (await httpClient.get<AuthUserResponse>('/auth/me')).data.user,
    registerGuardian: async (input) =>
      (await httpClient.post<AuthUserResponse>('/auth/register/responsavel', input)).data,
    registerStudent: async (input) =>
      (await httpClient.post<RegisterStudentResponse>('/auth/register/aluno', input)).data,
  },
  students: crud<Student>(), guardians: crud<Guardian>(), classes: crud<ClassGroup>(),
  lessons: crud<Lesson>(), belts: crud<Belt>(), notices: crud<Notice>(),
  materials: { ...crud<StudyMaterial>(), upload: notConfigured },
  attendance: { listByLesson: notConfigured, saveMany: notConfigured, summary: notConfigured },
  graduations: { listByStudent: notConfigured, create: notConfigured },
};

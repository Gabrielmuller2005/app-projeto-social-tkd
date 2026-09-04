export type UserRole = 'ADMIN' | 'TEACHER' | 'GUARDIAN' | 'STUDENT';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
}

export interface Guardian extends User {
  role: 'GUARDIAN';
  birthDate: string;
  address: string;
  studentIds: string[];                                                                                                                                                                                                                 
}

export interface Student extends User {
  role: 'STUDENT';
  birthDate: string;
  address: string;
  guardianId?: string;
  classId?: string;
  beltId?: string;
}

export interface ClassGroup {
  id: string;
  name: string;
  weekDays: string[];
  startTime: string;
  endTime: string;
  teacherId: string;
  studentIds: string[];
}

export interface Lesson {
  id: string;
  classId: string;
  date: string;
  startTime: string;
  endTime: string;
  topic: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
}

export interface AttendanceRecord {
  lessonId: string;
  studentId: string;
  present: boolean;
  note?: string;
}

export interface Belt {
  id: string;
  name: string;
  grade: string;
  color: string;
  order: number;
}

export interface Graduation {
  id: string;
  studentId: string;
  beltId: string;
  awardedAt: string;
  notes?: string;
}

export interface Notice {
  id: string;
  title: string;
  body: string;
  category: 'GENERAL' | 'CLASS' | 'MATERIAL' | 'STUDENT_NOTE';
  audience: UserRole[];
  publishedAt: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  description?: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  downloadUrl: string;
  publishedAt: string;
}

export interface LoginInput { phone: string; password: string }
export interface AuthSession { token: string; user: User }
export type UserProfile = 'PROFESSOR' | 'RESPONSAVEL' | 'ALUNO';

export interface AuthUser {
  id: number;
  nome_completo: string;
  telefone: string;
  data_nascimento: string;
  endereco: string;
  perfil: UserProfile;
  ativo?: boolean;
  criado_em?: string;
  atualizado_em?: string;
}

export interface AuthLoginInput { telefone: string; senha: string }
export interface AuthSessionResponse { token: string; user: AuthUser }

// GET /auth/me e os registros de conta (responsável/aluno maior) devolvem { user }, sem token
export interface AuthUserResponse { user: AuthUser }

// POST /auth/register/responsavel — só estes 5 campos são aceitos pela API (sem cpf/email).
// Não retorna token: após o cadastro é preciso chamar login() com as mesmas credenciais.
export interface RegisterGuardianInput {
  nome_completo: string;
  telefone: string;
  senha: string;
  data_nascimento: string;
  endereco: string;
}

export interface RegisterStudentInput {
  nome_completo: string;
  data_nascimento: string;
  parentesco?: string;
  telefone?: string;
  senha?: string;
  endereco?: string;
}

export interface RegisteredMinorStudent {
  id: number;
  nome_completo: string;
  data_nascimento: string;
  telefone?: string;
  endereco?: string;
}

export interface RegisterStudentResponse {
  user?: AuthUser;
  aluno?: RegisteredMinorStudent;
}


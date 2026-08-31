import type {
  AttendanceRecord,
  AuthSession,
  Belt,
  ClassGroup,
  Graduation,
  Guardian,
  Lesson,
  LoginInput,
  Notice,
  Student,
  StudyMaterial,
} from '../models';

// Contrato único para a integração. A equipe de backend pode implementar esta
// interface com fetch/axios sem alterar as telas.
export interface AppApi {
  auth: {
    login(input: LoginInput): Promise<AuthSession>;
    requestPasswordReset(phone: string): Promise<void>;
    logout(): Promise<void>;
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

// Substitua este objeto por uma implementação HTTP ou injete outro AppApi.
export const api: AppApi = {
  auth: { login: notConfigured, requestPasswordReset: notConfigured, logout: notConfigured },
  students: crud<Student>(), guardians: crud<Guardian>(), classes: crud<ClassGroup>(),
  lessons: crud<Lesson>(), belts: crud<Belt>(), notices: crud<Notice>(),
  materials: { ...crud<StudyMaterial>(), upload: notConfigured },
  attendance: { listByLesson: notConfigured, saveMany: notConfigured, summary: notConfigured },
  graduations: { listByStudent: notConfigured, create: notConfigured },
};

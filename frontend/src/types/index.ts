export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
}

export const PROGRAMMING_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'cpp',
  'csharp',
  'php',
  'ruby',
  'go',
  'rust',
  'swift',
  'kotlin',
  'html',
  'css',
  'sql',
  'bash',
] as const;

export type ProgrammingLanguage = typeof PROGRAMMING_LANGUAGES[number];
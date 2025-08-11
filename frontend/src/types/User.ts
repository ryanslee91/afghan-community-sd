export interface User {
  id: number;
  email: string;
  nickname: string;
  role: string;
  languages: string[];
}

export interface AuthState {
  user: User | null;
}
export interface User {
  id: number;
  email: string;
  nickname?: string;
  role?: string;
}

export interface AuthState {
  user: User | null;
}
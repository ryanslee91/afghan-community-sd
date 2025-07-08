export interface AuthUser {
  id: number;
  email: string;
  role: Role;
  nickname?: string;
  createdAt?: Date;
}

export enum Role {
  USER,
  GUEST,
  ADMIN,
}

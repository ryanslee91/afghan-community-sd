import { User as PrismaUser } from '@prisma/client';

export type AuthUser = Omit<PrismaUser, 'hashedPassword'>;

// export interface AuthUser {
//   id: number;
//   email: string;
//   role: Role;
//   nickname: string;
//   createdAt?: Date;
//   languages: Languages[];
// }

// export enum Role {
//   USER,
//   GUEST,
//   MENTOR,
//   ADMIN,
// }

// export enum Languages {
//   DARI,
//   PASHTO,
//   ENGLISH,
// }

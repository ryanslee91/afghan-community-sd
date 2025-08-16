import { Language } from "./Languages";

export interface SignUpDto {
  email: string;
  password: string;
  nickname: string;
  languages: Language[];
}

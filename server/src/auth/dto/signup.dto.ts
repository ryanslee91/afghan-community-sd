import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

enum Language {
  DARI = 'DARI',
  PASHTO = 'PASHTO',
  ENGLISH = 'ENGLISH',
}

export class SignUpDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  @MinLength(2)
  nickname!: string;

  @IsEnum(Language)
  languages!: Language[];
}

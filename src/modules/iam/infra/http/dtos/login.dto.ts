import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'usuario@email.com', description: 'Email do usuario' })
  @IsEmail({}, { message: 'Email invalido' })
  email: string;

  @ApiProperty({ example: 'senha123', description: 'Senha do usuario' })
  @IsString()
  @MinLength(1, { message: 'Senha e obrigatoria' })
  password: string;
}

export class GoogleLoginDto {
  @ApiProperty({ description: 'Token de autenticacao do Google' })
  @IsString()
  google_token: string;
}

export class GitHubLoginDto {
  @ApiProperty({ description: 'Token de autenticacao do GitHub' })
  @IsString()
  github_token: string;
}

import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'usuario@email.com', description: 'Email do usuario' })
  @IsEmail({}, { message: 'Email invalido' })
  email: string;

  @ApiProperty({ example: 'senha123', description: 'Senha do usuario (minimo 6 caracteres)' })
  @IsString()
  @MinLength(6, { message: 'Senha deve ter no minimo 6 caracteres' })
  @MaxLength(100)
  password: string;

  @ApiProperty({ example: 'Nome Completo', description: 'Nome completo do usuario' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  full_name: string;
}

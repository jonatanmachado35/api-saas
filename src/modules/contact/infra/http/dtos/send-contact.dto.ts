import { IsEmail, IsString, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendContactDto {
  @ApiProperty({ example: 'Nome', description: 'Nome do remetente (2-100 caracteres)' })
  @IsString()
  @MinLength(2, { message: 'Nome deve ter no minimo 2 caracteres' })
  @MaxLength(100, { message: 'Nome deve ter no maximo 100 caracteres' })
  name: string;

  @ApiProperty({ example: 'email@exemplo.com', description: 'Email do remetente' })
  @IsEmail({}, { message: 'Email invalido' })
  email: string;

  @ApiPropertyOptional({ example: 'Empresa XYZ', description: 'Nome da empresa (opcional)' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  company?: string;

  @ApiProperty({ example: 'Assunto da mensagem', description: 'Assunto (5-200 caracteres)' })
  @IsString()
  @MinLength(5, { message: 'Assunto deve ter no minimo 5 caracteres' })
  @MaxLength(200, { message: 'Assunto deve ter no maximo 200 caracteres' })
  subject: string;

  @ApiProperty({ example: 'Conteudo da mensagem...', description: 'Mensagem (10-2000 caracteres)' })
  @IsString()
  @MinLength(10, { message: 'Mensagem deve ter no minimo 10 caracteres' })
  @MaxLength(2000, { message: 'Mensagem deve ter no maximo 2000 caracteres' })
  message: string;
}

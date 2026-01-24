import { IsString, IsOptional, MaxLength, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Novo Nome', description: 'Nome completo do usuario' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  full_name?: string;

  @ApiPropertyOptional({ example: 'https://exemplo.com/avatar.jpg', description: 'URL do avatar' })
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'URL invalida' })
  avatar_url?: string;
}

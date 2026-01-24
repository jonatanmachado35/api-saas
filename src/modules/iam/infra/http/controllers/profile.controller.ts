import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { GetProfileUseCase, UpdateProfileUseCase } from '../../../application/use-cases/profile.use-cases';
import { JwtAuthGuard } from '../../security/jwt-auth.guard';
import { CloudinaryService } from '../../../../shared/infra/cloudinary/cloudinary.service';
import { UpdateProfileDto } from '../dtos/update-profile.dto';

@ApiTags('Profiles')
@Controller('profiles')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProfileController {
  constructor(
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get(':user_id')
  @ApiOperation({ summary: 'Obter perfil do usuario' })
  @ApiResponse({ status: 200, description: 'Dados do perfil' })
  @ApiResponse({ status: 404, description: 'Usuario nao encontrado' })
  async getProfile(@Param('user_id') userId: string) {
    return this.getProfileUseCase.execute(userId);
  }

  @Put(':user_id')
  @ApiOperation({ summary: 'Atualizar perfil do usuario' })
  @ApiResponse({ status: 200, description: 'Perfil atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuario nao encontrado' })
  async updateProfile(
    @Param('user_id') userId: string,
    @Body() body: UpdateProfileDto,
  ) {
    return this.updateProfileUseCase.execute(userId, body);
  }

  @Post(':user_id/avatar')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiOperation({ summary: 'Fazer upload de avatar' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
          description: 'Imagem do avatar (JPEG, PNG, GIF, WEBP - max 5MB)',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Avatar atualizado com sucesso' })
  @ApiResponse({ status: 400, description: 'Arquivo invalido' })
  async uploadAvatar(
    @Param('user_id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.cloudinaryService.uploadImage(file, 'avatars');

    await this.updateProfileUseCase.execute(userId, {
      avatar_url: result.secure_url,
    });

    return {
      url: result.secure_url,
    };
  }
}

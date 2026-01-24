import { Module, Global } from '@nestjs/common';
import { CloudinaryProvider } from './infra/cloudinary/cloudinary.provider';
import { CloudinaryService } from './infra/cloudinary/cloudinary.service';

@Global()
@Module({
  providers: [CloudinaryProvider, CloudinaryService],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class SharedModule {}

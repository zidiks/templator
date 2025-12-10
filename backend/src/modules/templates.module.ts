import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TemplatesService } from '../templates/templates.service';
import { TemplatesController } from '../templates/templates.controller';

@Module({
  imports: [MulterModule.register({ dest: 'storage/templates' })],
  controllers: [TemplatesController],
  providers: [TemplatesService],
  exports: [TemplatesService],
})
export class TemplatesModule {}

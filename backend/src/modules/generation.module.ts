import { Module } from '@nestjs/common';
import { TemplatesModule } from './templates.module';
import { GenerationController } from '../templates/generation.controller';

@Module({
  imports: [TemplatesModule],
  controllers: [GenerationController],
})
export class GenerationModule {}

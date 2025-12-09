import { Module } from '@nestjs/common';
import { TemplatesModule } from './templates.module';
import { GenerationModule } from './generation.module';

@Module({
  imports: [TemplatesModule, GenerationModule],
})
export class AppModule {}

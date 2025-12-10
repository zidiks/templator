import { BadRequestException, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TemplatesService } from '../templates/templates.service';
import { TemplatesController } from '../templates/templates.controller';

@Module({
  imports: [
    MulterModule.register({
      dest: 'storage/templates',
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        const isDocx =
          file.mimetype ===
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          file.originalname.toLowerCase().endsWith('.docx');
        if (!isDocx) {
          return cb(new BadRequestException('Only .docx files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  ],
  controllers: [TemplatesController],
  providers: [TemplatesService],
  exports: [TemplatesService],
})
export class TemplatesModule {}

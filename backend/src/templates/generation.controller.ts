import { BadRequestException, Body, Controller, Get, Logger, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { TemplatesService } from './templates.service';

@Controller('templates')
export class GenerationController {
  private readonly logger = new Logger(GenerationController.name);

  constructor(private readonly templates: TemplatesService) {}

  @Get(':id/form')
  getForm(@Param('id') id: string) {
    this.logger.debug(`GET /templates/${id}/form`);
    const template = this.templates.findOne(id);
    return { templateId: id, fields: template.fields };
  }

  @Post(':id/generate')
  generate(@Param('id') id: string, @Body() payload: Record<string, any>, @Res() res: Response) {
    this.logger.debug(`POST /templates/${id}/generate payload=${JSON.stringify(payload)}`);
    const template = this.templates.findOne(id);

    if (!template.fileName) {
      throw new BadRequestException('Для шаблона не загружен .docx файл');
    }

    const missing = template.fields.filter(
      (f) => f.required && (payload[f.name] === undefined || payload[f.name] === ''),
    );
    if (missing.length) {
      throw new BadRequestException(`Заполните обязательные поля: ${missing.map((m) => m.label).join(', ')}`);
    }

    const templatePath = path.join(process.cwd(), 'storage', 'templates', template.fileName);
    if (!fs.existsSync(templatePath)) {
      throw new BadRequestException('Файл шаблона не найден. Загрузите .docx заново.');
    }

    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

    doc.setData(payload);

    try {
      doc.render();
    } catch (error: any) {
      const nestedErrors = error?.properties?.errors as any[] | undefined;
      const details = Array.isArray(nestedErrors)
        ? nestedErrors
            .map((err) => err?.properties?.explanation || err?.message)
            .filter(Boolean)
            .join('; ')
        : '';

      const message = details
        ? `Не удалось собрать документ: ${details}. Убедитесь, что теги вида {{field}} не разорваны и корректно закрыты.`
        : 'Не удалось собрать документ. Проверьте заполненные поля и шаблон.';

      this.logger.error(`Ошибка генерации: ${error?.message}`, error?.stack || error);
      throw new BadRequestException(message);
    }

    const buffer = doc.getZip().generate({ type: 'nodebuffer' });
    const safeName = template.name.replace(/[^\w\d-_]+/g, '_').slice(0, 80) || 'document';
    const downloadName = `${safeName}_generated.docx`;

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(downloadName)}"`,
    });

    return res.send(buffer);
  }
}

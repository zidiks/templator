import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TemplatesService } from './templates.service';

@Controller('templates')
export class GenerationController {
  constructor(private readonly templates: TemplatesService) {}

  @Get(':id/form')
  getForm(@Param('id') id: string) {
    const template = this.templates.findOne(id);
    return { templateId: id, fields: template.fields };
  }

  @Post(':id/generate')
  generate(@Param('id') id: string, @Body() payload: Record<string, any>) {
    const template = this.templates.findOne(id);
    const missing = template.fields.filter((f) => f.required && payload[f.name] === undefined);
    if (missing.length) {
      return { status: 'error', message: 'Missing required fields', missing: missing.map((m) => m.name) };
    }
    const result = {
      templateId: id,
      filePath: `storage/generated/${id}-${Date.now()}.json`,
      data: payload,
    };
    return { status: 'ok', result };
  }
}

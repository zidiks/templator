import { Body, Controller, Delete, Get, Logger, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TemplatesService } from './templates.service';
import { TemplateDto, FieldSchemaDto } from './dto';

@Controller('templates')
export class TemplatesController {
  private readonly logger = new Logger(TemplatesController.name);

  constructor(private readonly templates: TemplatesService) {}

  @Get()
  getAll() {
    this.logger.debug('GET /templates');
    return this.templates.list();
  }

  @Post()
  createTemplate(@Body() payload: TemplateDto) {
    this.logger.debug(`POST /templates payload=${JSON.stringify(payload)}`);
    return this.templates.create(payload);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    this.logger.debug(`GET /templates/${id}`);
    return this.templates.findOne(id);
  }

  @Put(':id/fields-schema')
  updateSchema(@Param('id') id: string, @Body() fields: FieldSchemaDto[]) {
    this.logger.debug(`PUT /templates/${id}/fields-schema fields=${JSON.stringify(fields)}`);
    return this.templates.updateSchema(id, fields);
  }

  @Post(':id/file')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    this.logger.debug(
      `POST /templates/${id}/file file=${file?.originalname || 'unknown'} type=${file?.mimetype}`,
    );
    return this.templates.attachFile(id, file.filename, file.originalname, file.mimetype);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.logger.debug(`DELETE /templates/${id}`);
    this.templates.remove(id);
    return { status: 'ok' };
  }
}

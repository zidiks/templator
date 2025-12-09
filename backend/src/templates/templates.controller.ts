import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TemplatesService } from './templates.service';
import { TemplateDto, FieldSchemaDto } from './dto';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templates: TemplatesService) {}

  @Get()
  getAll() {
    return this.templates.list();
  }

  @Post()
  createTemplate(@Body() payload: TemplateDto) {
    return this.templates.create(payload);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.templates.findOne(id);
  }

  @Put(':id/fields-schema')
  updateSchema(@Param('id') id: string, @Body() fields: FieldSchemaDto[]) {
    return this.templates.updateSchema(id, fields);
  }

  @Post(':id/file')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    return this.templates.attachFile(id, file.filename, file.mimetype);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.templates.remove(id);
    return { status: 'ok' };
  }
}

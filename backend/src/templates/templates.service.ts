import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { TemplateDto } from './dto';

export interface StoredTemplate extends TemplateDto {
  id: string;
  fileName?: string;
  fileType?: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class TemplatesService {
  private readonly dbPath = path.join(process.cwd(), 'storage', 'templates.json');

  private read(): StoredTemplate[] {
    if (!fs.existsSync(this.dbPath)) {
      fs.mkdirSync(path.dirname(this.dbPath), { recursive: true });
      fs.writeFileSync(this.dbPath, '[]');
    }
    const raw = fs.readFileSync(this.dbPath, 'utf8');
    return JSON.parse(raw);
  }

  private write(data: StoredTemplate[]) {
    fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2));
  }

  list() {
    return this.read();
  }

  create(payload: TemplateDto): StoredTemplate {
    const templates = this.read();
    const now = new Date().toISOString();
    const entity: StoredTemplate = {
      ...payload,
      id: (Date.now()).toString(),
      createdAt: now,
      updatedAt: now,
    };
    templates.push(entity);
    this.write(templates);
    return entity;
  }

  findOne(id: string): StoredTemplate {
    const found = this.read().find((t) => t.id === id);
    if (!found) throw new NotFoundException('Template not found');
    return found;
  }

  updateSchema(id: string, fields: TemplateDto['fields']) {
    const templates = this.read();
    const index = templates.findIndex((t) => t.id === id);
    if (index === -1) throw new NotFoundException('Template not found');
    templates[index].fields = fields;
    templates[index].updatedAt = new Date().toISOString();
    this.write(templates);
    return templates[index];
  }

  attachFile(id: string, fileName: string, fileType: string) {
    const templates = this.read();
    const index = templates.findIndex((t) => t.id === id);
    if (index === -1) throw new NotFoundException('Template not found');
    templates[index].fileName = fileName;
    templates[index].fileType = fileType;
    templates[index].updatedAt = new Date().toISOString();
    this.write(templates);
    return templates[index];
  }

  remove(id: string) {
    const templates = this.read();
    const filtered = templates.filter((t) => t.id !== id);
    if (filtered.length === templates.length) throw new NotFoundException('Template not found');
    this.write(filtered);
  }
}

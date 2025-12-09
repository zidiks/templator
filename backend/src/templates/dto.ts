import { IsBoolean, IsIn, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export type FieldType = 'string' | 'textarea' | 'richtext' | 'date' | 'number' | 'auto';

export class FieldSchemaDto {
  @IsString()
  name!: string;

  @IsString()
  label!: string;

  @IsIn(['string', 'textarea', 'richtext', 'date', 'number', 'auto'])
  type!: FieldType;

  @IsBoolean()
  required!: boolean;

  @IsOptional()
  @IsString()
  placeholder?: string;

  @IsOptional()
  @IsString()
  format?: string;

  @IsOptional()
  source?: string;

  @IsOptional()
  transform?: string;
}

export class TemplateDto {
  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsBoolean()
  isActive!: boolean;

  @ValidateNested({ each: true })
  @Type(() => FieldSchemaDto)
  fields!: FieldSchemaDto[];
}

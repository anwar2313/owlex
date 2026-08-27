import {
  IsString,
  IsArray,
  IsOptional,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsString({ each: true })
  features: string[];

  @IsString()
  @IsNotEmpty()
  icon: string;

  @IsNumber()
  @IsOptional()
  order?: number;
}

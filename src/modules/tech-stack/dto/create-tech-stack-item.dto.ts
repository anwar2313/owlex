import {
  IsString,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class CreateTechStackItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @IsNumber()
  @IsOptional()
  order?: number;
}

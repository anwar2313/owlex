import {
  IsNumber,
  IsString,
  IsOptional,
  IsNotEmpty,
  Min,
  Max,
} from 'class-validator';

export class CreateStatDto {
  @IsNumber()
  @Min(0)
  value: number;

  @IsString()
  @IsOptional()
  suffix?: string;

  @IsString()
  @IsNotEmpty()
  label: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  barPercent: number;

  @IsNumber()
  @IsOptional()
  order?: number;
}

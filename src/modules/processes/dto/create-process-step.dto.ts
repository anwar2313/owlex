import { IsNumber, IsString, IsNotEmpty, Min } from 'class-validator';

export class CreateProcessStepDto {
  @IsNumber()
  @Min(1)
  stepNumber: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

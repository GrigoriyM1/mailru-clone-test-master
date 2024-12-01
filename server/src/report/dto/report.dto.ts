import { IsEnum, IsOptional, IsString } from "class-validator";

export class ReportDto {
  @IsEnum(['QUESTION', 'ANSWER'])
  type: 'QUESTION' | 'ANSWER';

  @IsString()
  elementId: string;

  @IsString()
  elementLink: string;

  @IsString()
  title: string 
  
  @IsString()
  @IsOptional()
  description?: string 
}
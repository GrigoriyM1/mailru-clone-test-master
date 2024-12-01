import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateNotificationDto {
  @IsString()
	title: string;

  @IsString()
	text: string;
  
  @IsString()
	url: string;

  @IsArray()
	avatars: string[];

  @IsOptional()
  @IsNumber()
  points?: number

  @IsOptional()
  @IsEnum(['DEFAULT', 'POINTS'])
  type?: 'DEFAULT' | 'POINTS'

  @IsOptional()
  @IsString()
	subtitle?: string;

  @IsString()
	userId: string;
}
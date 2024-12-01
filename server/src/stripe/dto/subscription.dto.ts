import { IsNumber, IsString } from "class-validator";

export class SubscriptionDto {
  @IsString()
  userId: string;

  @IsNumber()
  amount: number;

  @IsString()
  redirectUrl: string;
}
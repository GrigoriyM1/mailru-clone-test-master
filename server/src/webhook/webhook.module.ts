import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { StripeService } from '../stripe/stripe.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],  // Убедитесь, что здесь только UserModule
  controllers: [WebhookController],
  providers: [WebhookService, StripeService], // Уберите UserService
})
export class WebhookModule {}
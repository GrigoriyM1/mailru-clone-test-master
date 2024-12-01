import { Controller, Post, Headers, HttpCode, HttpStatus, RawBody, Body } from '@nestjs/common';
import { StripeService } from '../stripe/stripe.service';
import { UserService } from '../user/user.service';

@Controller('webhook')
export class WebhookController {
  constructor(
    private stripeService: StripeService,
    private userService: UserService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@RawBody() payload: any, @Headers('stripe-signature') signature: string) {
    const event = await this.stripeService.constructEvent(payload, signature); 

    switch (event.type) {
      // case 'checkout.session.completed': break;
      case 'customer.subscription.created':
        {
          const metadata = event.data.object.metadata;
          if (metadata?.type && metadata?.type === 'subscription') {
            this.userService.updateSubscriptionStatus(metadata?.userId, true)
          }
        }
        break;
      case 'customer.subscription.deleted':
        {
          const metadata = event.data.object.metadata;
          if (metadata?.type && metadata?.type === 'subscription') {
            this.userService.updateSubscriptionStatus(metadata?.userId, false)
          }        
        }
        break;
      default:
        // console.warn(`Unhandled event type ${event.type}`); 
        break;
    }
  }}
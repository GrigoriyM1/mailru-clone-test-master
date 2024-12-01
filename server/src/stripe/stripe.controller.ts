import { Controller, Post, Body, ValidationPipe, UsePipes, BadRequestException } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { SubscriptionDto } from './dto/subscription.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';

@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @Post('subscription')
  @Auth()
  @UsePipes(new ValidationPipe())
  subscription(
    @Body() dto: SubscriptionDto,
  ) {
    return this.stripeService.subscription(dto);
  }
}

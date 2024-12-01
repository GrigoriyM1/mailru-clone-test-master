import { BadRequestException, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { SubscriptionDto } from './dto/subscription.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private prisma: PrismaService;

  constructor(
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia',
      typescript: true,
    })
    this.prisma = new PrismaService()
  }

  async subscription(dto: SubscriptionDto) {
    const totalPrice = dto.amount
    const redirectUrl = dto.redirectUrl
    const userId = dto.userId

    const isVip = await this.prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        isVip: true
      }
    })

    if (isVip.isVip) {
      throw new BadRequestException('У вас уже есть vip')
    }

    return this.stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(totalPrice * 100), // cents 
            product_data: {
              name: 'Mailru clone',
            },
            recurring: {
              interval: 'month',
              interval_count: 1,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        type: 'subscription'
      },
      subscription_data: {
        metadata: {
          userId,
          type: 'subscription'
        },
      },
      success_url: redirectUrl,
      cancel_url: redirectUrl,
      // client_reference_id: userId,
    });  
  }

  async constructEvent(payload: any, signature: any) {
    return this.stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);
  }
}
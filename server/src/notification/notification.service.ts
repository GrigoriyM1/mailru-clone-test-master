import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { GatewayController } from '../gateway/gateway.controller';

@Injectable()
export class NotificationService {
  constructor(
    private prisma: PrismaService,
    private gatewayController: GatewayController,
  ) { }

  async getAll(userId: string) {
    return this.prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      }
    })
  }

  async create(dto: CreateNotificationDto) {
    this.gatewayController.onNotificationChanged({ userId: dto.userId });
    
    return this.prisma.notification.create({
      data: dto,
    });
  }

  async readAll(userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      }
    })
  }
}

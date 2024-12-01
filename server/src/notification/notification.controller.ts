import { Body, Controller, Get, Post, ValidationPipe, UsePipes } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { CurrentUser } from '../auth/decorators/user.decorator';

@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService, 
  ) {}

  @Get()
  @Auth()
  async getAll(
    @CurrentUser('id') userId: string,
  ) {
    return this.notificationService.getAll(userId)
  }

  @Post()
  @Auth()
  @UsePipes(new ValidationPipe())
  async create(@Body() dto: CreateNotificationDto) {
    return this.notificationService.create(dto);
  }

  @Post('/read-all')
  @Auth()
  async readAll(
    @CurrentUser('id') userId: string,
  ) {
    return this.notificationService.readAll(userId);
  }
}

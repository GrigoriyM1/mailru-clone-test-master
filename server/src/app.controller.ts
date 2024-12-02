import { Controller, Post, Headers, HttpCode, HttpStatus, RawBody, Body, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getWebhook() {
    return 'Webhook endpoint'
  }
}
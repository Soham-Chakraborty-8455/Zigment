/* eslint-disable prettier/prettier */
// src/controllers/notifications.controller.ts

import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NotificationsService } from '../services/notifications.service';
import { SendNotificationDto } from '../dto/send-notification.dto';
import { NotificationLog } from '../models/notification-log.schema';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiOperation({ summary: 'Send a notification' })
  @ApiResponse({ status: 201, description: 'The notification has been successfully sent.', type: NotificationLog })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Post('send')
  sendNotification(@Body() sendNotificationDto: SendNotificationDto) {
    return this.notificationsService.sendNotification(sendNotificationDto);
  }

  @ApiOperation({ summary: 'Get notification logs for a user' })
  @ApiResponse({ status: 200, description: 'An array of notification logs.', type: [NotificationLog] })
  @ApiResponse({ status: 404, description: 'No logs found for the user.' })
  @Get(':userId/logs')
  getNotificationLogs(@Param('userId') userId: string) {
    return this.notificationsService.getLogs(userId);
  }

  @ApiOperation({ summary: 'Get notification statistics' })
  @ApiResponse({ status: 200, description: 'Notification statistics.', schema: { example: { total: 100, sent: 90, failed: 10 } } })
  @Get('stats')
  getStats() {
    return this.notificationsService.getStats();
  }
}

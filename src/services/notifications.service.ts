/* eslint-disable prettier/prettier */
// src/services/notifications.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { NotificationLog } from '../models/notification-log.schema';
import { SendNotificationDto } from '../dto/send-notification.dto';
import { PreferencesService } from './preferences.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel('NotificationLog') private readonly notificationLogModel: Model<NotificationLog>,
    private readonly preferencesService: PreferencesService,
  ) {}

  /**
   * Send a notification to a user based on their preferences
   * @param sendNotificationDto - Data Transfer Object containing notification details
   * @returns The notification log entry
   */
  async sendNotification(sendNotificationDto: SendNotificationDto): Promise<NotificationLog> {
    const { userId, type, channel, content } = sendNotificationDto;

    // Validate notification type
    const validTypes = ['marketing', 'newsletter', 'updates'];
    if (!validTypes.includes(type)) {
      throw new BadRequestException(`Invalid notification type: ${type}`);
    }

    // Validate channel
    const validChannels = ['email', 'sms', 'push'];
    if (!validChannels.includes(channel)) {
      throw new BadRequestException(`Invalid notification channel: ${channel}`);
    }

    // Retrieve user preferences
    const userPreference = await this.preferencesService.getPreference(userId);

    // Check if the user has opted in for this type of notification
    if (!userPreference.preferences[type]) {
      throw new BadRequestException(`User has opted out of ${type} notifications.`);
    }

    // Check if the user has enabled the selected channel
    if (!userPreference.preferences.channels[channel]) {
      throw new BadRequestException(`User has disabled ${channel} notifications.`);
    }

    // Simulate sending notification (In real scenarios, integrate with email/SMS/Push services)
    let status: 'sent' | 'failed' = 'sent';
    let failureReason: string | undefined;

    try {
      // Simulate sending logic here
      console.log(`Sending ${type} notification to ${userId} via ${channel}: ${content.subject} - ${content.body}`);
      // Simulate possible failure
      // throw new Error('Simulated failure'); // Uncomment to simulate failure
    } catch (error) {
      status = 'failed';
      failureReason = error.message;
    }

    // Create a notification log entry
    const notificationLog = new this.notificationLogModel({
      userId,
      type,
      channel,
      status,
      sentAt: status === 'sent' ? new Date() : undefined,
      failureReason,
      metadata: { content },
    });

    await notificationLog.save();

    if (status === 'failed') {
      throw new BadRequestException(`Failed to send notification: ${failureReason}`);
    }

    return notificationLog;
  }

  /**
   * Retrieve notification logs for a specific user
   * @param userId - Unique identifier for the user
   * @returns An array of notification logs
   */
  async getLogs(userId: string): Promise<NotificationLog[]> {
    const logs = await this.notificationLogModel.find({ userId }).exec();
    if (!logs || logs.length === 0) {
      throw new NotFoundException(`No notification logs found for userId ${userId}.`);
    }
    return logs;
  }

  /**
   * Retrieve notification statistics
   * @returns An object containing statistics
   */
  async getStats(): Promise<any> {
    const totalNotifications = await this.notificationLogModel.countDocuments().exec();
    const sentNotifications = await this.notificationLogModel.countDocuments({ status: 'sent' }).exec();
    const failedNotifications = await this.notificationLogModel.countDocuments({ status: 'failed' }).exec();

    return {
      total: totalNotifications,
      sent: sentNotifications,
      failed: failedNotifications,
    };
  }
}

/* eslint-disable prettier/prettier */
// src/dto/send-notification.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsObject, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ContentDto {
  @ApiProperty({ description: 'Subject of the notification', example: 'Special Offer' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ description: 'Body of the notification', example: 'Check out our latest deals!' })
  @IsString()
  @IsNotEmpty()
  body: string;
}

export class SendNotificationDto {
  @ApiProperty({ description: 'Unique identifier for the user', example: 'user123' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Type of notification', enum: ['marketing', 'newsletter', 'updates'], example: 'marketing' })
  @IsEnum(['marketing', 'newsletter', 'updates'])
  type: 'marketing' | 'newsletter' | 'updates';

  @ApiProperty({ description: 'Channel to send the notification', enum: ['email', 'sms', 'push'], example: 'email' })
  @IsEnum(['email', 'sms', 'push'])
  channel: 'email' | 'sms' | 'push';

  @ApiProperty({ type: ContentDto })
  @IsObject()
  @ValidateNested()
  @Type(() => ContentDto)
  content: ContentDto;
}

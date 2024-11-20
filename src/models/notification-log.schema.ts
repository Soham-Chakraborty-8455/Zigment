/* eslint-disable prettier/prettier */
// src/models/notification-log.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationLogDocument = NotificationLog & Document;

@Schema({ timestamps: true })
export class NotificationLog {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, enum: ['marketing', 'newsletter', 'updates'] })
  type: 'marketing' | 'newsletter' | 'updates';

  @Prop({ required: true, enum: ['email', 'sms', 'push'] })
  channel: 'email' | 'sms' | 'push';

  @Prop({ required: true, enum: ['pending', 'sent', 'failed'], default: 'pending' })
  status: 'pending' | 'sent' | 'failed';

  @Prop()
  sentAt?: Date;

  @Prop()
  failureReason?: string;

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;
}

export const NotificationLogSchema = SchemaFactory.createForClass(NotificationLog);

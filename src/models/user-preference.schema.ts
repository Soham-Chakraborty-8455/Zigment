/* eslint-disable prettier/prettier */
// src/models/user-preference.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserPreferenceDocument = UserPreference & Document;

@Schema({ timestamps: true })
export class UserPreference {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true, lowercase: true })
  email: string;

  @Prop({
    required: true,
    type: {
      marketing: { type: Boolean, required: true },
      newsletter: { type: Boolean, required: true },
      updates: { type: Boolean, required: true },
      frequency: { type: String, enum: ['daily', 'weekly', 'monthly', 'never'], required: true },
      channels: {
        email: { type: Boolean, required: true },
        sms: { type: Boolean, required: true },
        push: { type: Boolean, required: true },
      },
    },
  })
  preferences: {
    marketing: boolean;
    newsletter: boolean;
    updates: boolean;
    frequency: 'daily' | 'weekly' | 'monthly' | 'never';
    channels: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };

  @Prop({ required: true })
  timezone: string;

  @Prop()
  lastUpdated: Date;

  @Prop()
  createdAt: Date;
}

export const UserPreferenceSchema = SchemaFactory.createForClass(UserPreference);

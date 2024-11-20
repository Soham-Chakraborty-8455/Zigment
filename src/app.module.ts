/* eslint-disable prettier/prettier */
// src/app.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PreferencesController } from './controllers/preferences.controller';
import { NotificationsController } from './controllers/notifications.controller';
import { PreferencesService } from './services/preferences.service';
import { NotificationsService } from './services/notifications.service';
import { UserPreference, UserPreferenceSchema } from './models/user-preference.schema';
import { NotificationLog, NotificationLogSchema } from './models/notification-log.schema';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([
      { name: UserPreference.name, schema: UserPreferenceSchema },
      { name: NotificationLog.name, schema: NotificationLogSchema },
    ]),
  ],
  controllers: [PreferencesController, NotificationsController],
  providers: [PreferencesService, NotificationsService],
})
export class AppModule {}

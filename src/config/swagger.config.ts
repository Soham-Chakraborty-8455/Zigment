/* eslint-disable prettier/prettier */
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('User Notification Preferences API')
    .setDescription('API for managing user notification preferences and sending notifications.')
    .setVersion('1.0')
    .addTag('Preferences')
    .addTag('Notifications')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
}

/* eslint-disable prettier/prettier */
// src/swagger.ts

import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Sets up Swagger documentation for the Nest.js application.
 * @param app - The Nest.js application instance
 */
export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('User Notification Preferences API')
    .setDescription('API for managing user notification preferences and sending notifications.')
    .setVersion('1.0')
    .addTag('Preferences')
    .addTag('Notifications')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(process.env.SWAGGER_PATH || 'api/docs', app, document);
}

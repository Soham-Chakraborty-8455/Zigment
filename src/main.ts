/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';

// import { setupSwagger } from '../src/config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api'); // Set global API prefix
  setupSwagger(app);

  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on: http://localhost:${process.env.PORT || 3000}/api/docs`);
}
bootstrap();

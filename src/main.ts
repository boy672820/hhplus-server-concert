import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { validationPipeOptions, classSerializerOptions } from './app-config';
import * as swagger from '../swagger.json';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), classSerializerOptions),
  );
  SwaggerModule.setup('docs', app, swagger as any);
  await app.listen(3000);
}
bootstrap();

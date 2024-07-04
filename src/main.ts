import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { validationPipeOptions, classSerializerOptions } from './app-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), classSerializerOptions),
  );
  await app.listen(3000);
}
bootstrap();

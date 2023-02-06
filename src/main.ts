import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExeptionsFilter } from './common/filter/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new AllExeptionsFilter());

  await app.listen(8080);
}
bootstrap();

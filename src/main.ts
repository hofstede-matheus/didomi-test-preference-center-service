import { NestFactory } from '@nestjs/core';
import { AppModule } from './core/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  DOCS_PATH,
  DOCUMENT_TITLE,
  DOCUMENT_DESCRIPTION,
  DOCS_OPTIONS,
} from './core/infra/presentation/http/docs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  SwaggerModule.setup(
    DOCS_PATH,
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle(DOCUMENT_TITLE)
        .setDescription(DOCUMENT_DESCRIPTION)
        .build(),
    ),
    DOCS_OPTIONS,
  );

  await app.listen(process.env.API_PORT ?? 3000);
}
bootstrap();

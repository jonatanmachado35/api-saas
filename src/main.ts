import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './core/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpAdapterHost = app.get(HttpAdapterHost);

  // CORS - BEFORE global prefix so root healthcheck works
  const allowedOrigins = process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : '*';
  
  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global prefix (applied after controllers are loaded)
  app.setGlobalPrefix('api', {
    exclude: ['/'], // Exclude root path for health check
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Exception filter
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('AgentChat API')
    .setDescription('API para gerenciamento de agentes de chat com IA')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  
  console.log(`========================================`);
  console.log(`🚀 Application is running!`);
  console.log(`📍 URL: http://0.0.0.0:${port}`);
  console.log(`📍 Health: http://0.0.0.0:${port}/`);
  console.log(`📍 API: http://0.0.0.0:${port}/api`);
  console.log(`📚 Swagger: http://0.0.0.0:${port}/api/docs`);
  console.log(`========================================`);
}
bootstrap();

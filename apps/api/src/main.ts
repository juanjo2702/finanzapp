import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Enable CORS for Web and Mobile clients
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Global Exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger OpenAPI Documentation
  const config = new DocumentBuilder()
    .setTitle('Finanzapp API')
    .setDescription(
      'Enterprise Personal Finance Management (PFM) Platform API. Includes multi-currency accounts, 50/30/20 budgeting, advanced analytics, and Bolivia & International bank notification parsers.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Autenticación y tokens')
    .addTag('Users', 'Gestión de perfil y preferencias')
    .addTag('Accounts', 'Cuentas bancarias, efectivo y billeteras')
    .addTag('Categories', 'Categorías y regla 50/30/20')
    .addTag('Transactions', 'Registro de gastos, ingresos y transferencias')
    .addTag('Budgets', 'Límites de gastos y presupuestos mensuales')
    .addTag('Analytics', 'Métricas de patrimonio, flujo de caja y diagramas Sankey')
    .addTag('Banking & Automation', 'Parseo inteligente de SMS/Push bancarios y extractos')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);

  logger.log(`🚀 Finanzapp API running on: http://localhost:${port}/api`);
  logger.log(`📚 Swagger documentation available at: http://localhost:${port}/api/docs`);
}

bootstrap();

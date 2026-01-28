"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const all_exceptions_filter_1 = require("./core/filters/all-exceptions.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const httpAdapterHost = app.get(core_1.HttpAdapterHost);
    const allowedOrigins = process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
        : '*';
    app.enableCors({
        origin: allowedOrigins,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    app.setGlobalPrefix('api', {
        exclude: ['/'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter(httpAdapterHost));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('AgentChat API')
        .setDescription('API para gerenciamento de agentes de chat com IA')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
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
//# sourceMappingURL=main.js.map
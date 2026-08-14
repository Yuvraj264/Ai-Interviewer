"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@ai-interviewer/config");
const structured_logger_service_1 = require("./common/logger/structured-logger.service");
const correlation_id_middleware_1 = require("./common/middleware/correlation-id.middleware");
async function bootstrap() {
    const env = (0, config_1.getValidatedEnv)();
    const logger = new structured_logger_service_1.StructuredLoggerService();
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger,
    });
    app.enableShutdownHooks();
    app.use(new correlation_id_middleware_1.CorrelationIdMiddleware().use);
    app.enableCors({
        origin: process.env.NODE_ENV === 'production' ? ['https://interviewer.scaler.com'] : true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    await app.listen(env.API_PORT);
    logger.log(`API Server running on port ${env.API_PORT} [Phase 10 Hardened]`, 'Bootstrap');
}
bootstrap();
//# sourceMappingURL=main.js.map
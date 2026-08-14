"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@ai-interviewer/config");
async function bootstrap() {
    const env = (0, config_1.getValidatedEnv)();
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    await app.listen(env.API_PORT);
    console.log(`[API] Server running on port ${env.API_PORT}`);
}
bootstrap();
//# sourceMappingURL=main.js.map
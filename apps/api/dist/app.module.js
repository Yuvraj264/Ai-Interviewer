"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const health_controller_1 = require("./health/health.controller");
const interviews_controller_1 = require("./interviews/interviews.controller");
const interviews_service_1 = require("./interviews/interviews.service");
const realtime_service_1 = require("./interviews/realtime.service");
const dashboard_controller_1 = require("./dashboard/dashboard.controller");
const dashboard_service_1 = require("./dashboard/dashboard.service");
const demo_controller_1 = require("./demo/demo.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [health_controller_1.HealthController, interviews_controller_1.InterviewsController, dashboard_controller_1.DashboardController, demo_controller_1.DemoController],
        providers: [interviews_service_1.InterviewsService, realtime_service_1.RealtimeService, dashboard_service_1.DashboardService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeService = void 0;
const common_1 = require("@nestjs/common");
const livekit_server_sdk_1 = require("livekit-server-sdk");
const config_1 = require("@ai-interviewer/config");
const interviews_service_1 = require("./interviews.service");
let RealtimeService = class RealtimeService {
    constructor(interviewsService) {
        this.interviewsService = interviewsService;
    }
    async generateCandidateToken(sessionId) {
        const session = this.interviewsService.getSession(sessionId);
        if (session.status === 'COMPLETED' || session.status === 'CANCELLED') {
            throw new common_1.BadRequestException(`Cannot issue realtime token for interview session in state '${session.status}'`);
        }
        const env = (0, config_1.getValidatedEnv)();
        const roomName = `interview:${session.id}`;
        const participantIdentity = `candidate-${session.id}`;
        const at = new livekit_server_sdk_1.AccessToken(env.LIVEKIT_API_KEY, env.LIVEKIT_API_SECRET, {
            identity: participantIdentity,
            name: session.candidateName,
            ttl: '30m',
        });
        at.addGrant({
            roomJoin: true,
            room: roomName,
            canPublish: true,
            canSubscribe: true,
            canPublishData: true,
        });
        const token = await at.toJwt();
        return {
            token,
            url: env.LIVEKIT_URL,
            roomName,
            participantIdentity,
        };
    }
};
exports.RealtimeService = RealtimeService;
exports.RealtimeService = RealtimeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [interviews_service_1.InterviewsService])
], RealtimeService);
//# sourceMappingURL=realtime.service.js.map
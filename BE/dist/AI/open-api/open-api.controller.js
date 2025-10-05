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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenApiController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const open_api_service_1 = require("./open-api.service");
let OpenApiController = class OpenApiController {
    openApiService;
    constructor(openApiService) {
        this.openApiService = openApiService;
    }
    async getData(token) {
        if (token) {
            this.openApiService.setToken(token.replace('Bearer ', ''));
        }
        return this.openApiService.get('/');
    }
    async postData(token, data) {
        if (token) {
            this.openApiService.setToken(token.replace('Bearer ', ''));
        }
        return this.openApiService.post('/', data);
    }
    async getUserProgress() {
        return {
            currentProgress: 25,
            currentPool: 0,
            completedNumbers: [1, 2],
            failedAttempts: [3],
            totalCorrectAnswers: 8,
            totalIncorrectAnswers: 2,
            studyTimeSpent: 120,
            testTimeSpent: 180
        };
    }
};
exports.OpenApiController = OpenApiController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get data from external API' }),
    (0, swagger_1.ApiHeader)({ name: 'authorization', description: 'Bearer token for authentication', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Data retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'External API error' }),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OpenApiController.prototype, "getData", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Post data to external API' }),
    (0, swagger_1.ApiHeader)({ name: 'authorization', description: 'Bearer token for authentication', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Data posted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'External API error' }),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OpenApiController.prototype, "postData", null);
__decorate([
    (0, common_1.Get)('user-progress'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user progress stats' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User progress retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OpenApiController.prototype, "getUserProgress", null);
exports.OpenApiController = OpenApiController = __decorate([
    (0, swagger_1.ApiTags)('open-api'),
    (0, common_1.Controller)('open-api'),
    __metadata("design:paramtypes", [open_api_service_1.OpenApiService])
], OpenApiController);
//# sourceMappingURL=open-api.controller.js.map
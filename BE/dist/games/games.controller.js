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
exports.GamesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const games_service_1 = require("./games.service");
const start_game_dto_1 = require("./dto/start-game.dto");
const submit_answer_dto_1 = require("./dto/submit-answer.dto");
const submit_feedback_dto_1 = require("./dto/submit-feedback.dto");
let GamesController = class GamesController {
    gamesService;
    constructor(gamesService) {
        this.gamesService = gamesService;
    }
    startGame(dto) {
        return this.gamesService.startGame(dto);
    }
    getGame(id) {
        return this.gamesService.getGame(id);
    }
    submitAnswer(id, dto) {
        return this.gamesService.submitAnswer(id, dto);
    }
    getResult(id) {
        return this.gamesService.getGameResult(id);
    }
    submitFeedback(id, dto) {
        return this.gamesService.submitFeedback(id, dto);
    }
};
exports.GamesController = GamesController;
__decorate([
    (0, common_1.Post)('start'),
    (0, swagger_1.ApiOperation)({ summary: 'Start a new game' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Game started successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [start_game_dto_1.StartGameDto]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "startGame", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get game by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Game UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Game retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Game not found' }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "getGame", null);
__decorate([
    (0, common_1.Post)(':id/answer'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit an answer for a game' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Game UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Answer submitted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Game not found' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, submit_answer_dto_1.SubmitAnswerDto]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "submitAnswer", null);
__decorate([
    (0, common_1.Get)(':id/result'),
    (0, swagger_1.ApiOperation)({ summary: 'Get game result' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Game UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Game result retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Game not found' }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "getResult", null);
__decorate([
    (0, common_1.Post)(':id/feedback'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit feedback for a game' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Game UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Feedback submitted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Game not found' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, submit_feedback_dto_1.SubmitFeedbackDto]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "submitFeedback", null);
exports.GamesController = GamesController = __decorate([
    (0, swagger_1.ApiTags)('games'),
    (0, common_1.Controller)('api/games'),
    __metadata("design:paramtypes", [games_service_1.GamesService])
], GamesController);
//# sourceMappingURL=games.controller.js.map
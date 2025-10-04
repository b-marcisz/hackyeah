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
exports.Game = exports.GameStatus = exports.GameType = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
var GameType;
(function (GameType) {
    GameType["MATCH_HAO"] = "match_hao";
    GameType["MEMORY_FLASH"] = "memory_flash";
    GameType["NUMBER_STORY"] = "number_story";
    GameType["SPEED_RECALL"] = "speed_recall";
    GameType["ASSOCIATION_DUEL"] = "association_duel";
})(GameType || (exports.GameType = GameType = {}));
var GameStatus;
(function (GameStatus) {
    GameStatus["PENDING"] = "pending";
    GameStatus["IN_PROGRESS"] = "in_progress";
    GameStatus["COMPLETED"] = "completed";
    GameStatus["FAILED"] = "failed";
})(GameStatus || (exports.GameStatus = GameStatus = {}));
let Game = class Game {
    id;
    type;
    number;
    player_id;
    status;
    difficulty;
    settings;
    state;
    result;
    feedback;
    points;
    xp;
    started_at;
    completed_at;
    created_at;
    updated_at;
};
exports.Game = Game;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Game unique identifier', example: '123e4567-e89b-12d3-a456-426614174000' }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Game.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Game type', example: 'match_hao' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Game.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number for the game', example: 42 }),
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Game.prototype, "number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Player ID', example: '123e4567-e89b-12d3-a456-426614174000', nullable: true }),
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Game.prototype, "player_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Game status', example: 'pending' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'pending' }),
    __metadata("design:type", String)
], Game.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Game difficulty level', example: 3 }),
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], Game.prototype, "difficulty", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Game settings', example: { theme: 'dark', sound: true } }),
    (0, typeorm_1.Column)({ type: 'jsonb', default: () => "'{}'" }),
    __metadata("design:type", Object)
], Game.prototype, "settings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Game state', example: { currentStep: 1, score: 0 } }),
    (0, typeorm_1.Column)({ type: 'jsonb', default: () => "'{}'" }),
    __metadata("design:type", Object)
], Game.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Game result', example: { finalScore: 100, timeSpent: 30000 } }),
    (0, typeorm_1.Column)({ type: 'jsonb', default: () => "'{}'" }),
    __metadata("design:type", Object)
], Game.prototype, "result", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Player feedback', example: [{ message: 'Great game!', rating: 5, createdAt: '2024-01-01T00:00:00Z' }] }),
    (0, typeorm_1.Column)({ type: 'jsonb', default: () => "'[]'" }),
    __metadata("design:type", Array)
], Game.prototype, "feedback", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Points earned', example: 100 }),
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Game.prototype, "points", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Experience points earned', example: 50 }),
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Game.prototype, "xp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Game start time', example: '2024-01-01T00:00:00Z', nullable: true }),
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Game.prototype, "started_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Game completion time', example: '2024-01-01T00:05:00Z', nullable: true }),
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Game.prototype, "completed_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp', example: '2024-01-01T00:00:00Z' }),
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Game.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last update timestamp', example: '2024-01-01T00:05:00Z' }),
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Game.prototype, "updated_at", void 0);
exports.Game = Game = __decorate([
    (0, typeorm_1.Entity)({ name: 'games' })
], Game);
//# sourceMappingURL=game.entity.js.map
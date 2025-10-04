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
exports.StartGameDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const game_entity_1 = require("../game.entity");
class StartGameDto {
    type;
    number;
    playerId;
    difficulty;
    settings;
}
exports.StartGameDto = StartGameDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: game_entity_1.GameType,
        description: 'Type of game to start',
        example: game_entity_1.GameType.MATCH_HAO
    }),
    (0, class_validator_1.IsEnum)(game_entity_1.GameType),
    __metadata("design:type", String)
], StartGameDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Optional number for the game',
        example: 42,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], StartGameDto.prototype, "number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Optional player ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], StartGameDto.prototype, "playerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Game difficulty level (1-5)',
        example: 3,
        minimum: 1,
        maximum: 5,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], StartGameDto.prototype, "difficulty", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Optional game settings',
        example: { theme: 'dark', sound: true },
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], StartGameDto.prototype, "settings", void 0);
//# sourceMappingURL=start-game.dto.js.map
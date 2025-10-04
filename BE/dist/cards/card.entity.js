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
exports.Card = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let Card = class Card {
    id;
    title;
    description;
    createdAt;
    updatedAt;
};
exports.Card = Card;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Card unique identifier', example: '123e4567-e89b-12d3-a456-426614174000' }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Card.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Card title', example: 'Number 42' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Card.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Card description', example: 'The answer to life, the universe, and everything' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Card.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp', example: '2024-01-01T00:00:00Z' }),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Card.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last update timestamp', example: '2024-01-01T00:05:00Z' }),
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Card.prototype, "updatedAt", void 0);
exports.Card = Card = __decorate([
    (0, typeorm_1.Entity)()
], Card);
//# sourceMappingURL=card.entity.js.map
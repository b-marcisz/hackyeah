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
exports.CardsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cards_service_1 = require("./cards.service");
const card_entity_1 = require("./card.entity");
const create_card_dto_1 = require("./dto/create-card-dto");
const common_2 = require("@nestjs/common");
const update_card_dto_1 = require("./dto/update-card-dto");
let CardsController = class CardsController {
    cardsService;
    constructor(cardsService) {
        this.cardsService = cardsService;
    }
    getCards() {
        return this.cardsService.getCards();
    }
    getCardById(id) {
        return this.cardsService.getCardById(id);
    }
    createCard(createCardDto) {
        return this.cardsService.createCard(createCardDto);
    }
    updateCard(id, updateCardDto) {
        return this.cardsService.updateCard(id, updateCardDto);
    }
    deleteCard(id) {
        return this.cardsService.deleteCard(id);
    }
};
exports.CardsController = CardsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all cards' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cards retrieved successfully', type: [card_entity_1.Card] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CardsController.prototype, "getCards", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get card by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Card ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Card retrieved successfully', type: card_entity_1.Card }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Card not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CardsController.prototype, "getCardById", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new card' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Card created successfully', type: card_entity_1.Card }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, common_2.UsePipes)(new common_2.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_card_dto_1.CreateCardDto]),
    __metadata("design:returntype", Promise)
], CardsController.prototype, "createCard", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a card' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Card ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Card updated successfully', type: card_entity_1.Card }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Card not found' }),
    (0, common_2.UsePipes)(new common_2.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_card_dto_1.UpdateCardDto]),
    __metadata("design:returntype", Promise)
], CardsController.prototype, "updateCard", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a card' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Card ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Card deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Card not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CardsController.prototype, "deleteCard", null);
exports.CardsController = CardsController = __decorate([
    (0, swagger_1.ApiTags)('cards'),
    (0, common_1.Controller)('cards'),
    __metadata("design:paramtypes", [cards_service_1.CardsService])
], CardsController);
//# sourceMappingURL=cards.controller.js.map
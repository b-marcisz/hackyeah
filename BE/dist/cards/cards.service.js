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
exports.CardsService = void 0;
const common_1 = require("@nestjs/common");
const card_entity_1 = require("./card.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
let CardsService = class CardsService {
    cardsRepository;
    constructor(cardsRepository) {
        this.cardsRepository = cardsRepository;
    }
    async getCards() {
        return this.cardsRepository.find();
    }
    async getCardById(id) {
        const card = await this.cardsRepository.findOne({ where: { id } });
        if (!card) {
            throw new common_1.NotFoundException(`Card with id ${id} not found`);
        }
        return card;
    }
    async createCard(createCardDto) {
        const { title, description } = createCardDto;
        const card = this.cardsRepository.create({
            title,
            description,
        });
        return await this.cardsRepository.save(card);
    }
    async updateCard(id, updateCardDto) {
        const { title, description } = updateCardDto;
        const card = await this.getCardById(id);
        if (title !== undefined) {
            card.title = title;
        }
        if (description !== undefined) {
            card.description = description;
        }
        return await this.cardsRepository.save(card);
    }
    async deleteCard(id) {
        const result = await this.cardsRepository.delete({ id });
        if (!result.affected) {
            throw new common_1.NotFoundException(`Card with id ${id} not found`);
        }
    }
};
exports.CardsService = CardsService;
exports.CardsService = CardsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(card_entity_1.Card)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], CardsService);
//# sourceMappingURL=cards.service.js.map
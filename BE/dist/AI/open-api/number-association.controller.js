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
exports.NumberAssociationController = void 0;
const common_1 = require("@nestjs/common");
const number_association_service_1 = require("./number-association.service");
let NumberAssociationController = class NumberAssociationController {
    numberAssociationService;
    constructor(numberAssociationService) {
        this.numberAssociationService = numberAssociationService;
    }
    async generateAssociation(number) {
        console.log("genere ...");
        try {
            const result = await this.numberAssociationService.generateAssociation(number);
            return result;
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAssociation(number) {
        try {
            const association = await this.numberAssociationService.getAssociation(number);
            if (!association) {
                throw new common_1.HttpException('Association not found', common_1.HttpStatus.NOT_FOUND);
            }
            return association;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async rateAssociation(id, rating) {
        try {
            if (rating < 1 || rating > 5) {
                throw new common_1.HttpException('Rating must be between 1 and 5', common_1.HttpStatus.BAD_REQUEST);
            }
            return await this.numberAssociationService.updateRating(id, rating);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async generateAllAssociations() {
        try {
            const result = await this.numberAssociationService.generateAllAssociations();
            return {
                message: 'Successfully generated next 10 associations',
                count: result,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAllPrimaryAssociations() {
        try {
            return await this.numberAssociationService.getAllPrimaryAssociations();
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async checkAndRegenerateDuplicates() {
        try {
            return await this.numberAssociationService.checkAndRegenerateDuplicates();
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.NumberAssociationController = NumberAssociationController;
__decorate([
    (0, common_1.Post)(':number/generate'),
    __param(0, (0, common_1.Param)('number')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NumberAssociationController.prototype, "generateAssociation", null);
__decorate([
    (0, common_1.Get)(':number'),
    __param(0, (0, common_1.Param)('number')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NumberAssociationController.prototype, "getAssociation", null);
__decorate([
    (0, common_1.Post)(':id/rate'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('rating')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], NumberAssociationController.prototype, "rateAssociation", null);
__decorate([
    (0, common_1.Post)('generate-all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NumberAssociationController.prototype, "generateAllAssociations", null);
__decorate([
    (0, common_1.Get)('all/primary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NumberAssociationController.prototype, "getAllPrimaryAssociations", null);
__decorate([
    (0, common_1.Post)('check-duplicates'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NumberAssociationController.prototype, "checkAndRegenerateDuplicates", null);
exports.NumberAssociationController = NumberAssociationController = __decorate([
    (0, common_1.Controller)('number-associations'),
    __metadata("design:paramtypes", [number_association_service_1.NumberAssociationService])
], NumberAssociationController);
//# sourceMappingURL=number-association.controller.js.map
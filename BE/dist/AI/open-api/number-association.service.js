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
var NumberAssociationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberAssociationService = void 0;
const common_1 = require("@nestjs/common");
const open_api_service_1 = require("./open-api.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const number_association_entity_1 = require("../../entities/number-association.entity");
let NumberAssociationService = NumberAssociationService_1 = class NumberAssociationService {
    openApiService;
    numberAssociationRepository;
    logger = new common_1.Logger(NumberAssociationService_1.name);
    constructor(openApiService, numberAssociationRepository) {
        this.openApiService = openApiService;
        this.numberAssociationRepository = numberAssociationRepository;
    }
    extractJsonFromMarkdown(content) {
        const cleaned = content
            .replace(/^```json\s*/i, '')
            .replace(/```$/, '')
            .trim();
        try {
            return JSON.parse(cleaned);
        }
        catch (error) {
            this.logger.error('Failed to parse JSON:', error);
            throw new Error('Invalid JSON format in AI response');
        }
    }
    async generatePrompt(number) {
        return `Wybierz skojarzenie dla liczby ${number} w formacie "Bohater — Działanie — Przedmiot".
        Wymagania:
        - Bohater: znana postać (historyczna, mityczna, bajkowa).
        - Działanie: aktywne, konkretne.
        - Przedmiot: rozpoznawalny, wizualny.
        - Skojarzenie powinno metaforycznie przekazywać istotę liczby ${number} (jej formę, sens lub znaczenie kulturowe).
        - Odpowiedź ściśle w JSON:
        {
            "hero": "...",
            "action": "...",
            "object": "...",
            "explanation": "..."
        }`;
    }
    async callOpenAI(prompt) {
        const response = await this.openApiService.post('/v1/chat/completions', {
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: 'You are a creative assistant that generates number associations. Respond only with valid JSON, without markdown or formatting.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.7,
        });
        const message = response.choices?.[0]?.message?.content;
        if (!message) {
            throw new Error('Empty response from OpenAI');
        }
        return this.extractJsonFromMarkdown(message);
    }
    async generateAssociation(number) {
        try {
            const prompt = await this.generatePrompt(number);
            const content = await this.callOpenAI(prompt);
            this.logger.debug('Generated association content:', content);
            await this.numberAssociationRepository.update({ number }, { is_primary: false });
            const association = this.numberAssociationRepository.create({
                number,
                ...content,
                is_primary: true,
            });
            const saved = await this.numberAssociationRepository.save(association);
            this.logger.log(`Created new association for number ${number}`);
            return saved;
        }
        catch (error) {
            this.logger.error(`Failed to generate association for number ${number}:`, error);
            throw new Error(`Failed to generate association: ${error.message}`);
        }
    }
    async getAssociation(number) {
        return this.numberAssociationRepository.findOne({
            where: { number, is_primary: true },
        });
    }
    async updateRating(id, rating) {
        const association = await this.numberAssociationRepository.findOne({
            where: { id },
        });
        if (!association) {
            throw new Error('Association not found');
        }
        const newTotalVotes = association.total_votes + 1;
        const newRating = ((association.rating * association.total_votes) + rating) / newTotalVotes;
        association.rating = newRating;
        association.total_votes = newTotalVotes;
        return this.numberAssociationRepository.save(association);
    }
    async generateAllAssociations() {
        this.logger.log('Starting generation of next 10 associations');
        const existingNumbers = await this.numberAssociationRepository
            .createQueryBuilder('association')
            .select('DISTINCT association.number')
            .where('association.is_primary = :isPrimary', { isPrimary: true })
            .orderBy('association.number', 'ASC')
            .getRawMany();
        const existingNumberSet = new Set(existingNumbers.map(item => item.number));
        this.logger.log(`Found ${existingNumberSet.size} existing associations in database`);
        let successCount = 0;
        let skippedCount = 0;
        const errors = [];
        const maxToGenerate = 10;
        const numbersToGenerate = [];
        for (let number = 0; number <= 99 && numbersToGenerate.length < maxToGenerate; number++) {
            if (!existingNumberSet.has(number)) {
                numbersToGenerate.push(number);
            }
        }
        this.logger.log(`Will generate associations for numbers: ${numbersToGenerate.join(', ')}`);
        for (const number of numbersToGenerate) {
            try {
                await this.generateAssociation(number);
                successCount++;
                this.logger.debug(`Generated association for number ${number}`);
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            catch (error) {
                const errorMsg = `Failed to generate association for number ${number}: ${error.message}`;
                this.logger.error(errorMsg);
                errors.push(errorMsg);
            }
        }
        this.logger.log(`Generated ${successCount} new associations. Errors: ${errors.length}`);
        if (errors.length > 0) {
            this.logger.warn('Some associations failed to generate:', errors);
        }
        return successCount;
    }
    async getAllPrimaryAssociations() {
        return this.numberAssociationRepository.find({
            where: { is_primary: true },
            order: { number: 'ASC' },
            select: ['number', 'hero', 'action', 'object'],
        });
    }
    async checkAndRegenerateDuplicates() {
        this.logger.log('Checking for duplicate associations...');
        let duplicates = [];
        let regenerated = [];
        let hasDuplicates = true;
        let iteration = 0;
        const maxIterations = 10;
        while (hasDuplicates && iteration < maxIterations) {
            iteration++;
            this.logger.log(`Duplicate check iteration ${iteration}`);
            const associations = await this.numberAssociationRepository.find({
                where: { is_primary: true },
                order: { number: 'ASC' },
            });
            const seen = new Map();
            hasDuplicates = false;
            const heroMap = new Map();
            const actionMap = new Map();
            const objectMap = new Map();
            for (const association of associations) {
                if (heroMap.has(association.hero)) {
                    heroMap.get(association.hero).push(association.number);
                }
                else {
                    heroMap.set(association.hero, [association.number]);
                }
                if (actionMap.has(association.action)) {
                    actionMap.get(association.action).push(association.number);
                }
                else {
                    actionMap.set(association.action, [association.number]);
                }
                if (objectMap.has(association.object)) {
                    objectMap.get(association.object).push(association.number);
                }
                else {
                    objectMap.set(association.object, [association.number]);
                }
            }
            const duplicateNumbers = new Set();
            for (const [hero, numbers] of heroMap.entries()) {
                if (numbers.length > 1) {
                    hasDuplicates = true;
                    if (iteration === 1) {
                        duplicates.push({ number: numbers[0], hero, action: '', object: '' });
                    }
                    numbers.forEach(num => duplicateNumbers.add(num));
                }
            }
            for (const [action, numbers] of actionMap.entries()) {
                if (numbers.length > 1) {
                    hasDuplicates = true;
                    if (iteration === 1) {
                        duplicates.push({ number: numbers[0], hero: '', action, object: '' });
                    }
                    numbers.forEach(num => duplicateNumbers.add(num));
                }
            }
            for (const [object, numbers] of objectMap.entries()) {
                if (numbers.length > 1) {
                    hasDuplicates = true;
                    if (iteration === 1) {
                        duplicates.push({ number: numbers[0], hero: '', action: '', object });
                    }
                    numbers.forEach(num => duplicateNumbers.add(num));
                }
            }
            for (const number of duplicateNumbers) {
                try {
                    this.logger.log(`Regenerating association for number ${number} (has duplicate hero/action/object)`);
                    await this.generateAssociation(number);
                    regenerated.push(number);
                    await new Promise(resolve => setTimeout(resolve, 200));
                }
                catch (error) {
                    this.logger.error(`Failed to regenerate association for number ${number}:`, error);
                }
            }
        }
        const message = duplicates.length > 0
            ? `Found ${duplicates.length} duplicate patterns, regenerated ${regenerated.length} associations after ${iteration} iterations`
            : 'No duplicates found';
        this.logger.log(message);
        return {
            duplicates,
            regenerated,
            message,
        };
    }
};
exports.NumberAssociationService = NumberAssociationService;
exports.NumberAssociationService = NumberAssociationService = NumberAssociationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(number_association_entity_1.NumberAssociation)),
    __metadata("design:paramtypes", [open_api_service_1.OpenApiService,
        typeorm_2.Repository])
], NumberAssociationService);
//# sourceMappingURL=number-association.service.js.map
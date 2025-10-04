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
exports.GamesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const game_entity_1 = require("./game.entity");
const number_association_entity_1 = require("../entities/number-association.entity");
let GamesService = class GamesService {
    gamesRepository;
    associationsRepository;
    constructor(gamesRepository, associationsRepository) {
        this.gamesRepository = gamesRepository;
        this.associationsRepository = associationsRepository;
    }
    async startGame(dto) {
        const association = await this.resolveAssociation(dto.number);
        const difficulty = dto.difficulty ?? 1;
        const now = new Date();
        const state = await this.buildInitialState(dto.type, association, dto.settings);
        const game = this.gamesRepository.create({
            type: dto.type,
            number: association.number,
            player_id: dto.playerId ?? null,
            difficulty,
            status: 'in_progress',
            started_at: now,
            settings: dto.settings ?? {},
            state,
            result: { attempts: [] },
            points: 0,
            xp: 0,
        });
        const saved = await this.gamesRepository.save(game);
        return this.mapToResponse(saved);
    }
    async getGame(gameId) {
        const game = await this.getGameOrThrow(gameId);
        return this.mapToResponse(game);
    }
    async submitAnswer(gameId, dto) {
        const game = await this.getGameOrThrow(gameId);
        if (game.status !== 'in_progress') {
            throw new common_1.BadRequestException('Game is not active.');
        }
        const evaluation = this.evaluateAnswer(game, dto.answer, dto.timeSpentMs);
        const attempts = Array.isArray(game.result?.attempts)
            ? [...game.result.attempts]
            : [];
        const attempt = {
            answer: dto.answer,
            timeSpentMs: dto.timeSpentMs ?? null,
            isCorrect: evaluation.isCorrect,
            pointsAwarded: evaluation.points,
            xpAwarded: evaluation.xp,
            evaluatedAt: new Date().toISOString(),
        };
        attempts.push(attempt);
        game.result = {
            ...game.result,
            attempts,
            summary: {
                isCorrect: evaluation.isCorrect,
                points: evaluation.points,
                xp: evaluation.xp,
            },
            details: evaluation.details ?? {},
        };
        game.points = evaluation.points;
        game.xp = evaluation.xp;
        game.status = evaluation.isCorrect
            ? 'completed'
            : 'failed';
        game.completed_at = new Date();
        const updatedState = {
            ...(game.state ?? {}),
            lastAnswer: dto.answer,
            lastInteractionAt: new Date().toISOString(),
        };
        if (game.type === game_entity_1.GameType.MEMORY_FLASH) {
            updatedState.phase = 'completed';
            updatedState.reveal = {
                changedElement: game.state?.changedElement ?? null,
                modifiedScene: game.state?.modifiedScene ?? null,
            };
        }
        if (game.type === game_entity_1.GameType.SPEED_RECALL) {
            const previousAttempts = Number(game.state?.attempts ?? 0);
            updatedState.attempts = previousAttempts + 1;
        }
        game.state = updatedState;
        const saved = await this.gamesRepository.save(game);
        return this.mapToResponse(saved);
    }
    async getGameResult(gameId) {
        const game = await this.getGameOrThrow(gameId);
        return this.mapToResponse(game);
    }
    async submitFeedback(gameId, dto) {
        const game = await this.getGameOrThrow(gameId);
        const feedbackEntry = {
            message: dto.message,
            rating: dto.rating,
            createdAt: new Date().toISOString(),
        };
        const feedbackArray = Array.isArray(game.feedback)
            ? [...game.feedback]
            : [];
        feedbackArray.push(feedbackEntry);
        game.feedback = feedbackArray;
        const saved = await this.gamesRepository.save(game);
        return this.mapToResponse(saved);
    }
    async resolveAssociation(requestedNumber) {
        if (typeof requestedNumber === 'number') {
            const association = await this.associationsRepository.findOne({
                where: { number: requestedNumber },
                order: { rating: 'DESC', id: 'ASC' },
            });
            if (!association) {
                throw new common_1.NotFoundException(`No association found for number ${requestedNumber}.`);
            }
            return this.toAssociationSnapshot(association);
        }
        const candidates = await this.associationsRepository.find({
            where: { is_primary: true },
            take: 50,
        });
        if (!candidates.length) {
            throw new common_1.NotFoundException('No primary associations available.');
        }
        const randomIndex = Math.floor(Math.random() * candidates.length);
        return this.toAssociationSnapshot(candidates[randomIndex]);
    }
    toAssociationSnapshot(association) {
        return {
            id: association.id,
            number: association.number,
            hero: association.hero,
            action: association.action,
            object: association.object,
            explanation: association.explanation,
        };
    }
    async buildInitialState(type, association, settings) {
        const baseState = {
            association,
            settings: settings ?? {},
            createdAt: new Date().toISOString(),
        };
        switch (type) {
            case game_entity_1.GameType.MATCH_HAO:
                return {
                    ...baseState,
                    ...(await this.buildMatchHaoExtras(association)),
                };
            case game_entity_1.GameType.MEMORY_FLASH:
                return {
                    ...baseState,
                    ...(await this.buildMemoryFlashExtras(association, settings)),
                };
            case game_entity_1.GameType.SPEED_RECALL:
                return {
                    ...baseState,
                    prompt: `Вспомни ассоциацию для числа ${association.number}.`,
                    attempts: 0,
                };
            default:
                return baseState;
        }
    }
    resolveMemorizationTime(settings) {
        const rawValue = settings?.memorizationTime;
        if (typeof rawValue === 'number' && rawValue >= 3 && rawValue <= 10) {
            return rawValue;
        }
        return 5;
    }
    async getGameOrThrow(gameId) {
        const game = await this.gamesRepository.findOne({ where: { id: gameId } });
        if (!game) {
            throw new common_1.NotFoundException(`Game with id ${gameId} not found.`);
        }
        return game;
    }
    evaluateAnswer(game, answer, timeSpentMs) {
        const association = this.extractAssociation(game);
        let isCorrect = false;
        switch (game.type) {
            case game_entity_1.GameType.MATCH_HAO:
                isCorrect = this.validateMatchHaoAnswer(association, answer);
                break;
            case game_entity_1.GameType.MEMORY_FLASH:
                isCorrect = this.validateMemoryFlashAnswer(game, answer);
                break;
            case game_entity_1.GameType.SPEED_RECALL:
                isCorrect = this.validateSpeedRecallAnswer(association, answer);
                break;
            default:
                isCorrect = false;
        }
        const difficultyMultiplier = Math.max(game.difficulty ?? 1, 1);
        const basePoints = isCorrect ? 100 : 25;
        const baseXp = isCorrect ? 10 : 2;
        const timeBonus = typeof timeSpentMs === 'number' && timeSpentMs > 0
            ? Math.max(0, 5000 - timeSpentMs) / 1000
            : 0;
        const points = Math.max(0, Math.round((basePoints + timeBonus) * difficultyMultiplier));
        const xp = Math.max(0, Math.round(baseXp * difficultyMultiplier));
        const details = {
            expected: association,
            received: answer,
            timeSpentMs: timeSpentMs ?? null,
        };
        if (game.type === game_entity_1.GameType.MEMORY_FLASH) {
            details.changedElement = {
                expected: game.state?.changedElement ?? null,
                modifiedScene: game.state?.modifiedScene ?? null,
            };
        }
        return {
            isCorrect,
            points,
            xp,
            details,
        };
    }
    extractAssociation(game) {
        const association = game.state?.association;
        if (!association) {
            throw new common_1.BadRequestException('Game state is missing association data.');
        }
        return association;
    }
    validateMatchHaoAnswer(association, answer) {
        const hero = answer?.hero;
        const action = answer?.action;
        const object = answer?.object;
        if (typeof hero !== 'string' ||
            typeof action !== 'string' ||
            typeof object !== 'string') {
            return false;
        }
        return (hero.trim().toLowerCase() === association.hero.trim().toLowerCase() &&
            action.trim().toLowerCase() === association.action.trim().toLowerCase() &&
            object.trim().toLowerCase() === association.object.trim().toLowerCase());
    }
    validateMemoryFlashAnswer(game, answer) {
        const changed = answer?.changedElement;
        if (typeof changed !== 'string') {
            return false;
        }
        const lowered = changed.trim().toLowerCase();
        const expected = game.state?.changedElement;
        if (typeof expected !== 'string') {
            return false;
        }
        return lowered === expected.trim().toLowerCase();
    }
    validateSpeedRecallAnswer(association, answer) {
        const recall = answer?.recall;
        if (typeof recall !== 'string') {
            return false;
        }
        const normalized = recall.trim().toLowerCase();
        return (normalized.includes(association.hero.trim().toLowerCase()) ||
            normalized.includes(association.action.trim().toLowerCase()) ||
            normalized.includes(association.object.trim().toLowerCase()));
    }
    mapToResponse(game) {
        return {
            id: game.id,
            type: game.type,
            number: game.number,
            status: game.status,
            difficulty: game.difficulty,
            points: game.points,
            xp: game.xp,
            state: game.state ?? {},
            result: game.result ?? {},
            feedback: Array.isArray(game.feedback) ? game.feedback : [],
            playerId: game.player_id,
            startedAt: game.started_at,
            completedAt: game.completed_at,
            createdAt: game.created_at,
            updatedAt: game.updated_at,
        };
    }
    async buildMatchHaoExtras(association) {
        const candidates = await this.associationsRepository.find({
            where: { id: (0, typeorm_2.Not)(association.id) },
            take: 50,
        });
        const heroOptions = this.buildOptionSet(association.hero, candidates.map((item) => item.hero));
        const actionOptions = this.buildOptionSet(association.action, candidates.map((item) => item.action));
        const objectOptions = this.buildOptionSet(association.object, candidates.map((item) => item.object));
        return {
            prompt: `Подбери героя, действие и объект для числа ${association.number}.`,
            categories: {
                hero: heroOptions,
                action: actionOptions,
                object: objectOptions,
            },
        };
    }
    async buildMemoryFlashExtras(association, settings) {
        const candidates = await this.associationsRepository.find({
            where: { id: (0, typeorm_2.Not)(association.id) },
            take: 50,
        });
        const elements = [
            'hero',
            'action',
            'object',
        ];
        const changedElement = this.randomChoice(elements);
        const decoyValue = this.pickDecoyValue(association[changedElement], candidates.map((item) => item[changedElement]));
        const modifiedScene = {
            hero: association.hero,
            action: association.action,
            object: association.object,
            [changedElement]: decoyValue,
        };
        return {
            phase: 'memorizing',
            memorizationTime: this.resolveMemorizationTime(settings),
            changedElement,
            originalScene: {
                hero: association.hero,
                action: association.action,
                object: association.object,
            },
            modifiedScene,
        };
    }
    buildOptionSet(correctValue, decoyCandidates, desired = 4) {
        const options = [];
        const seen = new Set();
        const pushValue = (value) => {
            const normalized = value.trim().toLowerCase();
            if (!normalized || seen.has(normalized)) {
                return;
            }
            seen.add(normalized);
            options.push(value.trim());
        };
        pushValue(correctValue);
        for (const candidate of decoyCandidates) {
            if (candidate) {
                pushValue(candidate);
            }
            if (options.length >= desired) {
                break;
            }
        }
        return this.shuffleArray(options);
    }
    pickDecoyValue(correctValue, candidates) {
        const normalizedCorrect = correctValue.trim().toLowerCase();
        const filtered = candidates
            .map((value) => value?.trim())
            .filter((value) => {
            if (!value) {
                return false;
            }
            return value.toLowerCase() !== normalizedCorrect;
        });
        if (!filtered.length) {
            return `${correctValue} (alt)`;
        }
        return this.randomChoice(filtered);
    }
    shuffleArray(values) {
        const array = [...values];
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    randomChoice(values) {
        if (!values.length) {
            throw new common_1.BadRequestException('Cannot choose from an empty array.');
        }
        const index = Math.floor(Math.random() * values.length);
        return values[index];
    }
};
exports.GamesService = GamesService;
exports.GamesService = GamesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(game_entity_1.Game)),
    __param(1, (0, typeorm_1.InjectRepository)(number_association_entity_1.NumberAssociation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], GamesService);
//# sourceMappingURL=games.service.js.map
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Game, GameStatus, GameType } from './game.entity';
import { NumberAssociation } from '../entities/number-association.entity';
import { StartGameDto } from './dto/start-game.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { SubmitFeedbackDto } from './dto/submit-feedback.dto';

export interface GameFeedbackEntry {
  message: string;
  rating?: number;
  createdAt: string;
}

export interface GameResponse {
  id: string;
  type: GameType;
  number: number;
  status: GameStatus;
  difficulty: number;
  points: number;
  xp: number;
  state: Record<string, unknown>;
  result: Record<string, unknown>;
  feedback: GameFeedbackEntry[];
  playerId: string | null;
  startedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface AssociationSnapshot {
  id: number;
  number: number;
  hero: string;
  action: string;
  object: string;
  explanation?: string | null;
}

interface EvaluationResult {
  isCorrect: boolean;
  points: number;
  xp: number;
  details?: Record<string, unknown>;
}

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private readonly gamesRepository: Repository<Game>,
    @InjectRepository(NumberAssociation)
    private readonly associationsRepository: Repository<NumberAssociation>,
  ) {}

  async startGame(dto: StartGameDto): Promise<GameResponse> {
    const association = await this.resolveAssociation(dto.number);
    const difficulty = dto.difficulty ?? 1;
    const now = new Date();

    const state = await this.buildInitialState(
      dto.type,
      association,
      dto.settings,
    );

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

  async getGame(gameId: string): Promise<GameResponse> {
    const game = await this.getGameOrThrow(gameId);
    return this.mapToResponse(game);
  }

  async submitAnswer(
    gameId: string,
    dto: SubmitAnswerDto,
  ): Promise<GameResponse> {
    const game = await this.getGameOrThrow(gameId);
    if (game.status !== 'in_progress') {
      throw new BadRequestException('Game is not active.');
    }

    const evaluation = this.evaluateAnswer(game, dto.answer, dto.timeSpentMs);

    const attempts = Array.isArray((game.result as any)?.attempts)
      ? [...((game.result as any).attempts as unknown[])]
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
    const updatedState: Record<string, unknown> = {
      ...(game.state ?? {}),
      lastAnswer: dto.answer,
      lastInteractionAt: new Date().toISOString(),
    };

    if (game.type === GameType.MEMORY_FLASH) {
      updatedState.phase = 'completed';
      updatedState.reveal = {
        changedElement: (game.state as any)?.changedElement ?? null,
        modifiedScene: (game.state as any)?.modifiedScene ?? null,
      };
    }

    if (game.type === GameType.SPEED_RECALL) {
      const previousAttempts = Number((game.state as any)?.attempts ?? 0);
      updatedState.attempts = previousAttempts + 1;
    }

    game.state = updatedState;

    const saved = await this.gamesRepository.save(game);
    return this.mapToResponse(saved);
  }

  async getGameResult(gameId: string): Promise<GameResponse> {
    const game = await this.getGameOrThrow(gameId);
    return this.mapToResponse(game);
  }

  async submitFeedback(
    gameId: string,
    dto: SubmitFeedbackDto,
  ): Promise<GameResponse> {
    const game = await this.getGameOrThrow(gameId);

    const feedbackEntry: GameFeedbackEntry = {
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

  private async resolveAssociation(
    requestedNumber?: number,
  ): Promise<AssociationSnapshot> {
    if (typeof requestedNumber === 'number') {
      const association = await this.associationsRepository.findOne({
        where: { number: requestedNumber },
        order: { rating: 'DESC', id: 'ASC' },
      });

      if (!association) {
        throw new NotFoundException(
          `No association found for number ${requestedNumber}.`,
        );
      }

      return this.toAssociationSnapshot(association);
    }

    const candidates = await this.associationsRepository.find({
      where: { is_primary: true },
      take: 50,
    });

    if (!candidates.length) {
      throw new NotFoundException('No primary associations available.');
    }

    const randomIndex = Math.floor(Math.random() * candidates.length);
    return this.toAssociationSnapshot(candidates[randomIndex]);
  }

  private toAssociationSnapshot(
    association: NumberAssociation,
  ): AssociationSnapshot {
    return {
      id: association.id,
      number: association.number,
      hero: association.hero,
      action: association.action,
      object: association.object,
      explanation: association.explanation,
    };
  }

  private async buildInitialState(
    type: GameType,
    association: AssociationSnapshot,
    settings?: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    const baseState: Record<string, unknown> = {
      association,
      settings: settings ?? {},
      createdAt: new Date().toISOString(),
    };

    switch (type) {
      case GameType.MATCH_HAO:
        return {
          ...baseState,
          ...(await this.buildMatchHaoExtras(association)),
        };
      case GameType.MEMORY_FLASH:
        return {
          ...baseState,
          ...(await this.buildMemoryFlashExtras(association, settings)),
        };
      case GameType.SPEED_RECALL:
        return {
          ...baseState,
          prompt: `Вспомни ассоциацию для числа ${association.number}.`,
          attempts: 0,
        };
      default:
        return baseState;
    }
  }

  private resolveMemorizationTime(
    settings?: Record<string, unknown>,
  ): number {
    const rawValue = settings?.memorizationTime;
    if (typeof rawValue === 'number' && rawValue >= 3 && rawValue <= 10) {
      return rawValue;
    }

    return 5;
  }

  private async getGameOrThrow(gameId: string): Promise<Game> {
    const game = await this.gamesRepository.findOne({ where: { id: gameId } });
    if (!game) {
      throw new NotFoundException(`Game with id ${gameId} not found.`);
    }
    return game;
  }

  private evaluateAnswer(
    game: Game,
    answer: Record<string, unknown>,
    timeSpentMs?: number,
  ): EvaluationResult {
    const association = this.extractAssociation(game);
    let isCorrect = false;

    switch (game.type) {
      case GameType.MATCH_HAO:
        isCorrect = this.validateMatchHaoAnswer(association, answer);
        break;
      case GameType.MEMORY_FLASH:
        isCorrect = this.validateMemoryFlashAnswer(game, answer);
        break;
      case GameType.SPEED_RECALL:
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

    const points = Math.max(
      0,
      Math.round((basePoints + timeBonus) * difficultyMultiplier),
    );
    const xp = Math.max(0, Math.round(baseXp * difficultyMultiplier));

    const details: Record<string, unknown> = {
      expected: association,
      received: answer,
      timeSpentMs: timeSpentMs ?? null,
    };

    if (game.type === GameType.MEMORY_FLASH) {
      details.changedElement = {
        expected: (game.state as any)?.changedElement ?? null,
        modifiedScene: (game.state as any)?.modifiedScene ?? null,
      };
    }

    return {
      isCorrect,
      points,
      xp,
      details,
    };
  }

  private extractAssociation(game: Game): AssociationSnapshot {
    const association = (game.state as any)?.association;
    if (!association) {
      throw new BadRequestException('Game state is missing association data.');
    }
    return association as AssociationSnapshot;
  }

  private validateMatchHaoAnswer(
    association: AssociationSnapshot,
    answer: Record<string, unknown>,
  ): boolean {
    const hero = answer?.hero;
    const action = answer?.action;
    const object = answer?.object;

    if (
      typeof hero !== 'string' ||
      typeof action !== 'string' ||
      typeof object !== 'string'
    ) {
      return false;
    }

    return (
      hero.trim().toLowerCase() === association.hero.trim().toLowerCase() &&
      action.trim().toLowerCase() === association.action.trim().toLowerCase() &&
      object.trim().toLowerCase() === association.object.trim().toLowerCase()
    );
  }

  private validateMemoryFlashAnswer(
    game: Game,
    answer: Record<string, unknown>,
  ): boolean {
    const changed = answer?.changedElement;
    if (typeof changed !== 'string') {
      return false;
    }

    const lowered = changed.trim().toLowerCase();
    const expected = (game.state as any)?.changedElement;
    if (typeof expected !== 'string') {
      return false;
    }

    return lowered === expected.trim().toLowerCase();
  }

  private validateSpeedRecallAnswer(
    association: AssociationSnapshot,
    answer: Record<string, unknown>,
  ): boolean {
    const recall = answer?.recall;
    if (typeof recall !== 'string') {
      return false;
    }

    const normalized = recall.trim().toLowerCase();
    return (
      normalized.includes(association.hero.trim().toLowerCase()) ||
      normalized.includes(association.action.trim().toLowerCase()) ||
      normalized.includes(association.object.trim().toLowerCase())
    );
  }

  private mapToResponse(game: Game): GameResponse {
    return {
      id: game.id,
      type: game.type as any,
      number: game.number,
      status: game.status as any,
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

  private async buildMatchHaoExtras(
    association: AssociationSnapshot,
  ): Promise<Record<string, unknown>> {
    const candidates = await this.associationsRepository.find({
      where: { id: Not(association.id) },
      take: 50,
    });

    const heroOptions = this.buildOptionSet(
      association.hero,
      candidates.map((item) => item.hero),
    );
    const actionOptions = this.buildOptionSet(
      association.action,
      candidates.map((item) => item.action),
    );
    const objectOptions = this.buildOptionSet(
      association.object,
      candidates.map((item) => item.object),
    );

    return {
      prompt: `Подбери героя, действие и объект для числа ${association.number}.`,
      categories: {
        hero: heroOptions,
        action: actionOptions,
        object: objectOptions,
      },
    };
  }

  private async buildMemoryFlashExtras(
    association: AssociationSnapshot,
    settings?: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    const candidates = await this.associationsRepository.find({
      where: { id: Not(association.id) },
      take: 50,
    });

    const elements: Array<'hero' | 'action' | 'object'> = [
      'hero',
      'action',
      'object',
    ];
    const changedElement = this.randomChoice(elements);

    const decoyValue = this.pickDecoyValue(
      association[changedElement],
      candidates.map(
        (item) => (item as any)[changedElement] as string | undefined,
      ),
    );

    const modifiedScene = {
      hero: association.hero,
      action: association.action,
      object: association.object,
      [changedElement]: decoyValue,
    } as Record<string, unknown>;

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

  private buildOptionSet(
    correctValue: string,
    decoyCandidates: Array<string | undefined>,
    desired = 4,
  ): string[] {
    const options: string[] = [];
    const seen = new Set<string>();

    const pushValue = (value: string) => {
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

  private pickDecoyValue(
    correctValue: string,
    candidates: Array<string | undefined>,
  ): string {
    const normalizedCorrect = correctValue.trim().toLowerCase();
    const filtered = candidates
      .map((value) => value?.trim())
      .filter((value): value is string => {
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

  private shuffleArray<T>(values: T[]): T[] {
    const array = [...values];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  private randomChoice<T>(values: T[]): T {
    if (!values.length) {
      throw new BadRequestException('Cannot choose from an empty array.');
    }
    const index = Math.floor(Math.random() * values.length);
    return values[index];
  }
}

import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GamesService } from './games.service';
import { Game, GameStatus, GameType } from './game.entity';
import { NumberAssociation } from '../entities/number-association.entity';

const createGamesRepositoryMock = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
});

const createAssociationsRepositoryMock = () => ({
  findOne: jest.fn(),
  find: jest.fn(),
});

describe('GamesService', () => {
  let service: GamesService;
  let gamesRepository: ReturnType<typeof createGamesRepositoryMock>;
  let associationsRepository: ReturnType<typeof createAssociationsRepositoryMock>;

  beforeEach(async () => {
    gamesRepository = createGamesRepositoryMock();
    associationsRepository = createAssociationsRepositoryMock();
    associationsRepository.find.mockResolvedValue([]);

    const moduleRef = await Test.createTestingModule({
      providers: [
        GamesService,
        {
          provide: getRepositoryToken(Game),
          useValue: gamesRepository,
        },
        {
          provide: getRepositoryToken(NumberAssociation),
          useValue: associationsRepository,
        },
      ],
    }).compile();

    service = moduleRef.get(GamesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('starts a new game with the requested number', async () => {
    const association: NumberAssociation = {
      id: 1,
      number: 42,
      hero: 'Hero',
      action: 'Action',
      object: 'Object',
      explanation: 'Test explanation',
      is_primary: true,
      rating: 0,
      total_votes: 0,
      created_at: new Date(),
    } as NumberAssociation;

    associationsRepository.findOne.mockResolvedValue(association);
    associationsRepository.find.mockResolvedValue([
      {
        id: 2,
        number: 10,
        hero: 'Batman',
        action: 'Runs',
        object: 'Car',
        explanation: 'Alt 1',
        is_primary: true,
        rating: 0,
        total_votes: 0,
        created_at: new Date(),
      } as NumberAssociation,
      {
        id: 3,
        number: 24,
        hero: 'Sherlock Holmes',
        action: 'Investigates',
        object: 'Case',
        explanation: 'Alt 2',
        is_primary: true,
        rating: 0,
        total_votes: 0,
        created_at: new Date(),
      } as NumberAssociation,
    ]);

    const now = new Date();

    gamesRepository.create.mockImplementation((payload: Partial<Game>) => ({
      ...payload,
      id: 'temp-id',
      createdAt: now,
      updatedAt: now,
      startedAt: payload.startedAt ?? now,
      completedAt: null,
      feedback: [],
    } as Game));

    gamesRepository.save.mockImplementation(async (game: Game) => ({
      ...game,
      id: 'game-id',
      createdAt: now,
      updatedAt: now,
    }));

    const response = await service.startGame({
      type: GameType.MATCH_HAO,
      number: 42,
    });

    expect(gamesRepository.create).toHaveBeenCalled();
    expect(gamesRepository.save).toHaveBeenCalled();
    expect(response.id).toBe('game-id');
    expect(response.type).toBe(GameType.MATCH_HAO);
    expect(response.status).toBe(GameStatus.IN_PROGRESS);
    const state = response.state as any;
    expect(state.association.number).toBe(42);
    expect(state.categories.hero).toEqual(
      expect.arrayContaining(['Hero']),
    );
    expect(state.categories.hero.length).toBeGreaterThanOrEqual(1);
  });

  it('completes a match HAO game when the answer is correct', async () => {
    const now = new Date();
    const existingGame: Game = {
      id: 'game-id',
      type: GameType.MATCH_HAO,
      number: 42,
      playerId: null,
      status: GameStatus.IN_PROGRESS,
      difficulty: 2,
      settings: {},
      state: {
        association: {
          id: 1,
          number: 42,
          hero: 'Hero',
          action: 'Action',
          object: 'Object',
        },
      },
      result: { attempts: [] },
      feedback: [],
      points: 0,
      xp: 0,
      startedAt: now,
      completedAt: null,
      createdAt: now,
      updatedAt: now,
    } as Game;

    gamesRepository.findOne.mockResolvedValue(existingGame);
    gamesRepository.save.mockImplementation(async (game: Game) => game);

    const response = await service.submitAnswer('game-id', {
      answer: {
        hero: 'Hero',
        action: 'Action',
        object: 'Object',
      },
      timeSpentMs: 1200,
    });

    expect(gamesRepository.save).toHaveBeenCalled();
    expect(response.status).toBe(GameStatus.COMPLETED);
    expect(response.points).toBeGreaterThan(0);
    expect((response.result as any).summary.isCorrect).toBe(true);
  });

  it('throws when submitting an answer to a finished game', async () => {
    const finishedGame: Game = {
      id: 'finished-game',
      type: GameType.MATCH_HAO,
      number: 10,
      playerId: null,
      status: GameStatus.COMPLETED,
      difficulty: 1,
      settings: {},
      state: {
        association: {
          id: 2,
          number: 10,
          hero: 'Hero',
          action: 'Action',
          object: 'Object',
        },
      },
      result: { attempts: [] },
      feedback: [],
      points: 100,
      xp: 10,
      startedAt: new Date(),
      completedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Game;

    gamesRepository.findOne.mockResolvedValue(finishedGame);

    await expect(
      service.submitAnswer('finished-game', {
        answer: { hero: 'Hero', action: 'Action', object: 'Object' },
      }),
    ).rejects.toThrow('Game is not active.');
  });

  it('evaluates memory flash answers using the changed element stored in state', async () => {
    const now = new Date();
    const memoryGame: Game = {
      id: 'memory-game',
      type: GameType.MEMORY_FLASH,
      number: 15,
      playerId: null,
      status: GameStatus.IN_PROGRESS,
      difficulty: 1,
      settings: {},
      state: {
        association: {
          id: 5,
          number: 15,
          hero: 'Diver',
          action: 'Swims',
          object: 'Submarine',
        },
        changedElement: 'hero',
        modifiedScene: {
          hero: 'Pilot',
          action: 'Swims',
          object: 'Submarine',
        },
        phase: 'memorizing',
        memorizationTime: 5,
      },
      result: { attempts: [] },
      feedback: [],
      points: 0,
      xp: 0,
      startedAt: now,
      completedAt: null,
      createdAt: now,
      updatedAt: now,
    } as Game;

    gamesRepository.findOne.mockResolvedValue(memoryGame);
    gamesRepository.save.mockImplementation(async (game: Game) => game);

    const response = await service.submitAnswer('memory-game', {
      answer: { changedElement: 'hero' },
    });

    expect(response.status).toBe(GameStatus.COMPLETED);
    expect(response.points).toBeGreaterThan(0);
    expect((response.state as any).phase).toBe('completed');
  });

  it('marks memory flash answer as failed when changed element is incorrect', async () => {
    const now = new Date();
    const memoryGame: Game = {
      id: 'memory-game-fail',
      type: GameType.MEMORY_FLASH,
      number: 18,
      playerId: null,
      status: GameStatus.IN_PROGRESS,
      difficulty: 1,
      settings: {},
      state: {
        association: {
          id: 8,
          number: 18,
          hero: 'Painter',
          action: 'Draws',
          object: 'Canvas',
        },
        changedElement: 'object',
        modifiedScene: {
          hero: 'Painter',
          action: 'Draws',
          object: 'Brush',
        },
        phase: 'memorizing',
        memorizationTime: 5,
      },
      result: { attempts: [] },
      feedback: [],
      points: 0,
      xp: 0,
      startedAt: now,
      completedAt: null,
      createdAt: now,
      updatedAt: now,
    } as Game;

    gamesRepository.findOne.mockResolvedValue(memoryGame);
    gamesRepository.save.mockImplementation(async (game: Game) => game);

    const response = await service.submitAnswer('memory-game-fail', {
      answer: { changedElement: 'hero' },
    });

    expect(response.status).toBe(GameStatus.FAILED);
    expect(response.points).toBeGreaterThanOrEqual(0);
    expect((response.result as any).summary.isCorrect).toBe(false);
  });
});

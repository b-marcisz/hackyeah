import { Repository } from 'typeorm';
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
export declare class GamesService {
    private readonly gamesRepository;
    private readonly associationsRepository;
    constructor(gamesRepository: Repository<Game>, associationsRepository: Repository<NumberAssociation>);
    startGame(dto: StartGameDto): Promise<GameResponse>;
    getGame(gameId: string): Promise<GameResponse>;
    submitAnswer(gameId: string, dto: SubmitAnswerDto): Promise<GameResponse>;
    getGameResult(gameId: string): Promise<GameResponse>;
    submitFeedback(gameId: string, dto: SubmitFeedbackDto): Promise<GameResponse>;
    private resolveAssociation;
    private toAssociationSnapshot;
    private buildInitialState;
    private resolveMemorizationTime;
    private getGameOrThrow;
    private evaluateAnswer;
    private extractAssociation;
    private validateMatchHaoAnswer;
    private validateMemoryFlashAnswer;
    private validateSpeedRecallAnswer;
    private mapToResponse;
    private buildMatchHaoExtras;
    private buildMemoryFlashExtras;
    private buildOptionSet;
    private pickDecoyValue;
    private shuffleArray;
    private randomChoice;
}

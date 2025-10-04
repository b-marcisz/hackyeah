import { GamesService, GameResponse } from './games.service';
import { StartGameDto } from './dto/start-game.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { SubmitFeedbackDto } from './dto/submit-feedback.dto';
export declare class GamesController {
    private readonly gamesService;
    constructor(gamesService: GamesService);
    startGame(dto: StartGameDto): Promise<GameResponse>;
    getGame(id: string): Promise<GameResponse>;
    submitAnswer(id: string, dto: SubmitAnswerDto): Promise<GameResponse>;
    getResult(id: string): Promise<GameResponse>;
    submitFeedback(id: string, dto: SubmitFeedbackDto): Promise<GameResponse>;
}

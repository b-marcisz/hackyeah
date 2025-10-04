import { GameType } from '../game.entity';
export declare class StartGameDto {
    type: GameType;
    number?: number;
    playerId?: string;
    difficulty?: number;
    settings?: Record<string, unknown>;
}

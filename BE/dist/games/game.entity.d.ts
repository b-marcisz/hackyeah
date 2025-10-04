export declare enum GameType {
    MATCH_HAO = "match_hao",
    MEMORY_FLASH = "memory_flash",
    NUMBER_STORY = "number_story",
    SPEED_RECALL = "speed_recall",
    ASSOCIATION_DUEL = "association_duel"
}
export declare enum GameStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    FAILED = "failed"
}
export declare class Game {
    id: string;
    type: string;
    number: number;
    player_id: string | null;
    status: string;
    difficulty: number;
    settings: Record<string, unknown>;
    state: Record<string, unknown>;
    result: Record<string, unknown>;
    feedback: Array<{
        message: string;
        rating?: number;
        createdAt: string;
    }>;
    points: number;
    xp: number;
    started_at: Date | null;
    completed_at: Date | null;
    created_at: Date;
    updated_at: Date;
}

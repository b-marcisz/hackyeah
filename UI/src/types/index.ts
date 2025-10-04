export enum GameType {
  MATCH_HAO = 'match_hao',
  MEMORY_FLASH = 'memory_flash',
  NUMBER_STORY = 'number_story',
  SPEED_RECALL = 'speed_recall',
  ASSOCIATION_DUEL = 'association_duel',
}

export enum GameStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

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

export interface AssociationSnapshot {
  id: number;
  number: number;
  hero: string;
  action: string;
  object: string;
  explanation?: string | null;
}

export interface StartGameRequest {
  type: GameType;
  number?: number;
  playerId?: string;
  difficulty?: number;
  settings?: Record<string, unknown>;
}

export interface SubmitAnswerRequest {
  answer: Record<string, unknown>;
  timeSpentMs?: number;
}

export interface SubmitFeedbackRequest {
  message: string;
  rating?: number;
}

export interface GameState {
  association: AssociationSnapshot;
  prompt?: string;
  categories?: {
    hero: string[];
    action: string[];
    object: string[];
  };
  phase?: 'memorizing' | 'comparing';
  memorizationTime?: number;
  attempts?: number;
  settings?: Record<string, unknown>;
  createdAt: string;
}

export interface GameResult {
  attempts?: Array<{
    answer: Record<string, unknown>;
    timeSpentMs: number | null;
    isCorrect: boolean;
    pointsAwarded: number;
    xpAwarded: number;
    evaluatedAt: string;
  }>;
  summary?: {
    isCorrect: boolean;
    points: number;
    xp: number;
  };
  details?: Record<string, unknown>;
}

export interface GameInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  difficulty: number;
  estimatedTime: string;
}

// API Types matching NestJS backend

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

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export enum ProfileColor {
  PINK_PURPLE = 'pinkPurple',
  BLUE = 'blue',
  GREEN = 'green',
  PINK = 'pink',
  ORANGE = 'orange',
  LAVENDER = 'lavender',
}

export interface UserSettings {
  timeLimit: number;
}

// Account DTOs
export interface CreateAccountDto {
  name: string;
  code: string;
}

export interface CreateUserDto {
  name: string;
  role: UserRole;
  color?: ProfileColor;
  settings: UserSettings;
}

export interface UpdateUserDto {
  name?: string;
  role?: UserRole;
  color?: ProfileColor;
  settings?: UserSettings;
}

export interface UserDto {
  id: string;
  name: string;
  role: UserRole;
  age?: number;
  color?: ProfileColor;
  settings?: UserSettings;
}

export interface UserSessionDto {
  id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  totalMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface AccountDto {
  id: string;
  users: UserDto[];
  code?: string;
}

// Game DTOs
export interface StartGameDto {
  type: GameType;
  number?: number;
  playerId?: string;
  difficulty?: number;
  settings?: Record<string, unknown>;
}

export interface SubmitAnswerDto {
  answer: Record<string, unknown>;
  timeSpentMs?: number;
}

export interface SubmitFeedbackDto {
  message: string;
  rating?: number;
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
  feedback: Array<{
    message: string;
    rating?: number;
    createdAt: string;
  }>;
  playerId: string | null;
  startedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Card DTOs
export interface Card {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  category?: string;
  difficulty?: number;
  points?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCardDto {
  title: string;
  description: string;
}

export interface UpdateCardDto {
  title?: string;
  description?: string;
}

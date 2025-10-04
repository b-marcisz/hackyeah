import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

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

@Entity({ name: 'games' })
export class Game {
  @ApiProperty({ description: 'Game unique identifier', example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Game type', example: 'match_hao' })
  @Column({ type: 'varchar', length: 50 })
  type: string;

  @ApiProperty({ description: 'Number for the game', example: 42 })
  @Column({ type: 'int' })
  number: number;

  @ApiProperty({ description: 'Player ID', example: '123e4567-e89b-12d3-a456-426614174000', nullable: true })
  @Column({ type: 'uuid', nullable: true })
  player_id: string | null;

  @ApiProperty({ description: 'Game status', example: 'pending' })
  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: string;

  @ApiProperty({ description: 'Game difficulty level', example: 3 })
  @Column({ type: 'int', default: 1 })
  difficulty: number;

  @ApiProperty({ description: 'Game settings', example: { theme: 'dark', sound: true } })
  @Column({ type: 'jsonb', default: () => "'{}'" })
  settings: Record<string, unknown>;

  @ApiProperty({ description: 'Game state', example: { currentStep: 1, score: 0 } })
  @Column({ type: 'jsonb', default: () => "'{}'" })
  state: Record<string, unknown>;

  @ApiProperty({ description: 'Game result', example: { finalScore: 100, timeSpent: 30000 } })
  @Column({ type: 'jsonb', default: () => "'{}'" })
  result: Record<string, unknown>;

  @ApiProperty({ description: 'Player feedback', example: [{ message: 'Great game!', rating: 5, createdAt: '2024-01-01T00:00:00Z' }] })
  @Column({ type: 'jsonb', default: () => "'[]'" })
  feedback: Array<{ message: string; rating?: number; createdAt: string }>;

  @ApiProperty({ description: 'Points earned', example: 100 })
  @Column({ type: 'int', default: 0 })
  points: number;

  @ApiProperty({ description: 'Experience points earned', example: 50 })
  @Column({ type: 'int', default: 0 })
  xp: number;

  @ApiProperty({ description: 'Game start time', example: '2024-01-01T00:00:00Z', nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  started_at: Date | null;

  @ApiProperty({ description: 'Game completion time', example: '2024-01-01T00:05:00Z', nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  completed_at: Date | null;

  @ApiProperty({ description: 'Creation timestamp', example: '2024-01-01T00:00:00Z' })
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @ApiProperty({ description: 'Last update timestamp', example: '2024-01-01T00:05:00Z' })
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}

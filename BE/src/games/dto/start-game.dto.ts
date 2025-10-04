import { IsEnum, IsInt, IsObject, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GameType } from '../game.entity';

export class StartGameDto {
  @ApiProperty({ 
    enum: GameType, 
    description: 'Type of game to start',
    example: GameType.MATCH_HAO
  })
  @IsEnum(GameType)
  type: GameType;

  @ApiProperty({ 
    description: 'Optional number for the game',
    example: 42,
    required: false
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  number?: number;

  @ApiProperty({ 
    description: 'Optional player ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false
  })
  @IsOptional()
  @IsUUID()
  playerId?: string;

  @ApiProperty({ 
    description: 'Game difficulty level (1-5)',
    example: 3,
    minimum: 1,
    maximum: 5,
    required: false
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  difficulty?: number;

  @ApiProperty({ 
    description: 'Optional game settings',
    example: { theme: 'dark', sound: true },
    required: false
  })
  @IsOptional()
  @IsObject()
  settings?: Record<string, unknown>;
}

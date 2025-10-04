import { IsInt, IsObject, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitAnswerDto {
  @ApiProperty({ 
    description: 'Answer data for the game',
    example: { association: 'forty-two', confidence: 0.8 }
  })
  @IsObject()
  answer: Record<string, unknown>;

  @ApiProperty({ 
    description: 'Time spent on the answer in milliseconds',
    example: 5000,
    required: false
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  timeSpentMs?: number;
}

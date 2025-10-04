import { IsInt, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitFeedbackDto {
  @ApiProperty({ 
    description: 'Feedback message',
    example: 'Great game! Very challenging.',
    minLength: 1
  })
  @IsString()
  @MinLength(1)
  message: string;

  @ApiProperty({ 
    description: 'Rating from 1 to 5',
    example: 4,
    minimum: 1,
    maximum: 5,
    required: false
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;
}

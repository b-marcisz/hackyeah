import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { GamesService, GameResponse } from './games.service';
import { StartGameDto } from './dto/start-game.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { SubmitFeedbackDto } from './dto/submit-feedback.dto';

@ApiTags('games')
@Controller('api/games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post('start')
  @ApiOperation({ summary: 'Start a new game' })
  @ApiResponse({ status: 201, description: 'Game started successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  startGame(@Body() dto: StartGameDto): Promise<GameResponse> {
    return this.gamesService.startGame(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get game by ID' })
  @ApiParam({ name: 'id', description: 'Game UUID' })
  @ApiResponse({ status: 200, description: 'Game retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Game not found' })
  getGame(@Param('id', new ParseUUIDPipe()) id: string): Promise<GameResponse> {
    return this.gamesService.getGame(id);
  }

  @Post(':id/answer')
  @ApiOperation({ summary: 'Submit an answer for a game' })
  @ApiParam({ name: 'id', description: 'Game UUID' })
  @ApiResponse({ status: 200, description: 'Answer submitted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Game not found' })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  submitAnswer(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: SubmitAnswerDto,
  ): Promise<GameResponse> {
    return this.gamesService.submitAnswer(id, dto);
  }

  @Get(':id/result')
  @ApiOperation({ summary: 'Get game result' })
  @ApiParam({ name: 'id', description: 'Game UUID' })
  @ApiResponse({ status: 200, description: 'Game result retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Game not found' })
  getResult(@Param('id', new ParseUUIDPipe()) id: string): Promise<GameResponse> {
    return this.gamesService.getGameResult(id);
  }

  @Post(':id/feedback')
  @ApiOperation({ summary: 'Submit feedback for a game' })
  @ApiParam({ name: 'id', description: 'Game UUID' })
  @ApiResponse({ status: 200, description: 'Feedback submitted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Game not found' })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  submitFeedback(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: SubmitFeedbackDto,
  ): Promise<GameResponse> {
    return this.gamesService.submitFeedback(id, dto);
  }
}

import { Controller, Get, Post, Body, Logger } from '@nestjs/common';
import { UserProgressService } from './user-progress.service';
import { NumberAssociation } from '../../entities/number-association.entity';

interface AnswerRequest {
  number: number;
  hero: string;
  action: string;
  object: string;
}

interface ProgressResponse {
  currentProgress: number;
  currentPool: number;
  completedNumbers: number[];
  failedAttempts: number[];
  totalCorrectAnswers: number;
  totalIncorrectAnswers: number;
  studyTimeSpent: number;
  testTimeSpent: number;
}

@Controller('user-progress')
export class UserProgressController {
  private readonly logger = new Logger(UserProgressController.name);

  constructor(private readonly userProgressService: UserProgressService) {}

  // GET /user-progress - получить текущий прогресс пользователя
  @Get()
  async getCurrentProgress(): Promise<ProgressResponse> {
    this.logger.log('📊 Getting current user progress...');
    
    const stats = await this.userProgressService.getUserStats();
    
    this.logger.log(`✅ Progress: ${stats.currentProgress}%, Pool: ${stats.currentPool}-${stats.currentPool + 2}`);
    return stats;
  }

  // GET /user-progress/study - получить ассоциации для изучения
  @Get('study')
  async getAssociationsForStudy(): Promise<NumberAssociation[]> {
    this.logger.log('📚 Getting associations for study...');
    
    const associations = await this.userProgressService.getAssociationsForStudy();
    
    this.logger.log(`✅ Returning ${associations.length} associations for study`);
    return associations;
  }

  // GET /user-progress/test - получить ассоциации для тестирования
  @Get('test')
  async getAssociationsForTest(): Promise<NumberAssociation[]> {
    this.logger.log('🧪 Getting associations for test...');
    
    const associations = await this.userProgressService.getAssociationsForTest();
    
    this.logger.log(`✅ Returning ${associations.length} shuffled associations for test`);
    return associations;
  }

  // POST /user-progress/answer - проверить ответ
  @Post('answer')
  async checkAnswer(@Body() answerRequest: AnswerRequest): Promise<{
    isCorrect: boolean;
    correctAnswer?: {
      hero: string;
      action: string;
      object: string;
    };
  }> {
    this.logger.log(`🔍 Checking answer for number ${answerRequest.number}`);
    
    const isCorrect = await this.userProgressService.checkAnswer(
      answerRequest.number,
      answerRequest.hero,
      answerRequest.action,
      answerRequest.object
    );

    let correctAnswer: { hero: string; action: string; object: string } | undefined = undefined;
    if (!isCorrect) {
      // Получаем правильный ответ для подсказки
      const progress = await this.userProgressService.getCurrentProgress();
      const associations = await this.userProgressService.getAssociationsForStudy();
      const correctAssociation = associations.find(a => a.number === answerRequest.number);
      
      if (correctAssociation) {
        correctAnswer = {
          hero: correctAssociation.hero,
          action: correctAssociation.action,
          object: correctAssociation.object,
        };
      }
    }

    this.logger.log(`✅ Answer is ${isCorrect ? 'correct' : 'incorrect'}`);
    return { isCorrect, correctAnswer };
  }

  // POST /user-progress/update - обновить прогресс
  @Post('update')
  async updateProgress(@Body() updateRequest: {
    success: boolean;
    number: number;
  }): Promise<ProgressResponse> {
    this.logger.log(`🔄 Updating progress: success=${updateRequest.success}, number=${updateRequest.number}`);
    
    await this.userProgressService.updateProgress(updateRequest.success, updateRequest.number);
    const stats = await this.userProgressService.getUserStats();
    
    this.logger.log(`✅ Progress updated: ${stats.currentProgress}%`);
    return stats;
  }

  // POST /user-progress/reset - сбросить прогресс
  @Post('reset')
  async resetProgress(): Promise<ProgressResponse> {
    this.logger.log('🔄 Resetting user progress...');
    
    // Удаляем текущий прогресс и создаем новый
    const progress = await this.userProgressService.getCurrentProgress();
    progress.currentProgress = 0;
    progress.currentPool = 0;
    progress.currentNumber = 0;
    progress.completedNumbers = [];
    progress.failedAttempts = [];
    progress.completedPools = [];
    progress.totalCorrectAnswers = 0;
    progress.totalIncorrectAnswers = 0;
    progress.studyTimeSpent = 0;
    progress.testTimeSpent = 0;
    
    await this.userProgressService['userProgressRepository'].save(progress);
    
    this.logger.log('✅ Progress reset to 0%');
    return await this.userProgressService.getUserStats();
  }

  // POST /user-progress/advance-pool - перейти к следующему пулу
  @Post('advance-pool')
  async advancePool(@Body() advanceRequest: {
    currentPool: number;
    poolSize: number;
    lastUpdated: string;
  }): Promise<ProgressResponse> {
    this.logger.log(`🏊 Advancing pool: currentPool=${advanceRequest.currentPool}, poolSize=${advanceRequest.poolSize}`);
    
    const stats = await this.userProgressService.advancePool(
      advanceRequest.currentPool,
      advanceRequest.poolSize
    );
    
    this.logger.log(`✅ Pool advanced to: ${stats.currentPool}`);
    return stats;
  }
}
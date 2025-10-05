import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProgress } from '../../entities/user-progress.entity';
import { NumberAssociation } from '../../entities/number-association.entity';

@Injectable()
export class UserProgressService {
  private readonly logger = new Logger(UserProgressService.name);

  constructor(
    @InjectRepository(UserProgress)
    private userProgressRepository: Repository<UserProgress>,
    @InjectRepository(NumberAssociation)
    private numberAssociationRepository: Repository<NumberAssociation>,
  ) {}

  // Получить текущий прогресс пользователя
  async getCurrentProgress(): Promise<UserProgress> {
    this.logger.log('🔍 Getting current user progress...');
    
    let progress = await this.userProgressRepository.findOne({
      where: { id: 1 } // Для простоты используем ID 1
    });

    if (!progress) {
      this.logger.log('📝 Creating new user progress...');
      progress = this.userProgressRepository.create({
        currentProgress: 0,
        currentPool: 0,
        currentNumber: 0,
        completedNumbers: [],
        failedAttempts: [],
        completedPools: [],
        totalCorrectAnswers: 0,
        totalIncorrectAnswers: 0,
        studyTimeSpent: 0,
        testTimeSpent: 0,
      });
      progress = await this.userProgressRepository.save(progress);
    }

    this.logger.log(`✅ Current progress: ${progress.currentProgress}%, Pool: ${progress.currentPool}-${progress.currentPool + 2}`);
    return progress;
  }

  // Обновить прогресс после успешного прохождения
  async updateProgress(success: boolean, number: number): Promise<UserProgress> {
    this.logger.log(`🔄 Updating progress: success=${success}, number=${number}`);
    
    const progress = await this.getCurrentProgress();
    
    if (success) {
      // Добавляем число в пройденные
      if (!progress.completedNumbers.includes(number)) {
        progress.completedNumbers.push(number);
        progress.totalCorrectAnswers++;
      }
      
      // Проверяем, завершен ли пул
      const poolNumbers = this.getPoolNumbers(progress.currentPool);
      const allPoolCompleted = poolNumbers.every(num => 
        progress.completedNumbers.includes(num)
      );
      
      if (allPoolCompleted) {
        this.logger.log(`🎉 Pool ${progress.currentPool}-${progress.currentPool + 2} completed!`);
        
        // Переходим к следующему пулу
        progress.currentPool += 3;
        progress.currentNumber = progress.currentPool;
        progress.currentProgress = Math.min(100, progress.currentProgress + 3);
        progress.completedPools.push(progress.currentPool - 3);
        
        // Очищаем пройденные числа для нового пула
        progress.completedNumbers = [];
        progress.failedAttempts = [];
      } else {
        // Переходим к следующему числу в пуле
        progress.currentNumber = number + 1;
      }
    } else {
      // Добавляем в неудачные попытки
      if (!progress.failedAttempts.includes(number)) {
        progress.failedAttempts.push(number);
        progress.totalIncorrectAnswers++;
      }
    }

    const savedProgress = await this.userProgressRepository.save(progress);
    this.logger.log(`✅ Progress updated: ${savedProgress.currentProgress}%`);
    return savedProgress;
  }

  // Перейти к следующему пулу
  async advancePool(nextPool: number, poolSize: number): Promise<UserProgress> {
    this.logger.log(`🏊 Advancing pool to: ${nextPool}`);
    
    const progress = await this.getCurrentProgress();
    
    // Обновляем пул
    progress.currentPool = nextPool;
    progress.currentNumber = nextPool;
    progress.currentProgress = Math.min(100, progress.currentProgress + 3);
    
    // Добавляем предыдущий пул в завершенные
    if (progress.currentPool > 0) {
      const previousPool = progress.currentPool - poolSize;
      if (!progress.completedPools.includes(previousPool)) {
        progress.completedPools.push(previousPool);
      }
    }
    
    // Очищаем пройденные числа для нового пула
    progress.completedNumbers = [];
    progress.failedAttempts = [];
    
    const savedProgress = await this.userProgressRepository.save(progress);
    this.logger.log(`✅ Pool advanced to: ${savedProgress.currentPool}`);
    return savedProgress;
  }

  // Получить ассоциации для изучения (3 цифры из текущего пула)
  async getAssociationsForStudy(): Promise<NumberAssociation[]> {
    this.logger.log('📚 Getting associations for study...');
    
    const progress = await this.getCurrentProgress();
    const poolNumbers = this.getPoolNumbers(progress.currentPool);
    
    const associations = await this.numberAssociationRepository.find({
      where: poolNumbers.map(number => ({ number })),
      order: { number: 'ASC' }
    });

    this.logger.log(`✅ Found ${associations.length} associations for study: ${poolNumbers.join(', ')}`);
    return associations;
  }

  // Получить ассоциации для тестирования (9 ассоциаций из пула)
  async getAssociationsForTest(): Promise<NumberAssociation[]> {
    this.logger.log('🧪 Getting associations for test...');
    
    const progress = await this.getCurrentProgress();
    const poolNumbers = this.getPoolNumbers(progress.currentPool);
    
    // Получаем все ассоциации из пула
    const poolAssociations = await this.numberAssociationRepository.find({
      where: poolNumbers.map(number => ({ number })),
      order: { number: 'ASC' }
    });

    // Создаем массив из 9 ассоциаций (3 числа × 3 ассоциации)
    const testAssociations: NumberAssociation[] = [];
    poolAssociations.forEach(association => {
      // Добавляем 3 копии каждой ассоциации для тестирования
      for (let i = 0; i < 3; i++) {
        testAssociations.push({ ...association });
      }
    });

    // Перемешиваем массив
    const shuffled = this.shuffleArray(testAssociations);
    
    this.logger.log(`✅ Prepared ${shuffled.length} shuffled associations for test`);
    return shuffled;
  }

  // Проверить правильность ответа
  async checkAnswer(number: number, hero: string, action: string, object: string): Promise<boolean> {
    this.logger.log(`🔍 Checking answer for number ${number}: ${hero} + ${action} + ${object}`);
    
    const association = await this.numberAssociationRepository.findOne({
      where: { number }
    });

    if (!association) {
      this.logger.warn(`❌ Association not found for number ${number}`);
      return false;
    }

    const isCorrect = association.hero === hero && 
                     association.action === action && 
                     association.object === object;

    this.logger.log(`✅ Answer is ${isCorrect ? 'correct' : 'incorrect'}`);
    return isCorrect;
  }

  // Получить статистику пользователя
  async getUserStats(): Promise<{
    currentProgress: number;
    currentPool: number;
    completedNumbers: number[];
    failedAttempts: number[];
    totalCorrectAnswers: number;
    totalIncorrectAnswers: number;
    studyTimeSpent: number;
    testTimeSpent: number;
  }> {
    const progress = await this.getCurrentProgress();
    
    return {
      currentProgress: progress.currentProgress,
      currentPool: progress.currentPool,
      completedNumbers: progress.completedNumbers,
      failedAttempts: progress.failedAttempts,
      totalCorrectAnswers: progress.totalCorrectAnswers,
      totalIncorrectAnswers: progress.totalIncorrectAnswers,
      studyTimeSpent: progress.studyTimeSpent,
      testTimeSpent: progress.testTimeSpent,
    };
  }

  // Вспомогательные методы
  private getPoolNumbers(pool: number): number[] {
    return [pool, pool + 1, pool + 2];
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
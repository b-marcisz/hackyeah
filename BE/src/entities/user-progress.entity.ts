import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('user_progress')
export class UserProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  currentProgress: number; // 0-100%

  @Column({ default: 0 })
  currentPool: number; // Текущий пул (0, 3, 6, 9, ...)

  @Column({ default: 0 })
  currentNumber: number; // Текущая цифра в пуле

  @Column({ type: 'json', default: '[]' })
  completedNumbers: number[]; // Пройденные цифры

  @Column({ type: 'json', default: '[]' })
  failedAttempts: number[]; // Неудачные попытки

  @Column({ type: 'json', default: '[]' })
  completedPools: number[]; // Пройденные пулы

  @Column({ default: 0 })
  totalCorrectAnswers: number; // Общее количество правильных ответов

  @Column({ default: 0 })
  totalIncorrectAnswers: number; // Общее количество неправильных ответов

  @Column({ default: 0 })
  studyTimeSpent: number; // Время изучения в секундах

  @Column({ default: 0 })
  testTimeSpent: number; // Время тестирования в секундах

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
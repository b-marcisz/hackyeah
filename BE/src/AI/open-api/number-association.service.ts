import { Injectable, Logger } from '@nestjs/common';
import { OpenApiService } from './open-api.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NumberAssociation } from '../../entities/number-association.entity';

interface AssociationResponse {
  hero: string;
  action: string;
  object: string;
  explanation: string;
}

@Injectable()
export class NumberAssociationService {
  private readonly logger = new Logger(NumberAssociationService.name);

  constructor(
    private readonly openApiService: OpenApiService,
    @InjectRepository(NumberAssociation)
    private readonly numberAssociationRepository: Repository<NumberAssociation>,
  ) {}

  private extractJsonFromMarkdown(content: string): AssociationResponse {
    const cleaned = content
      .replace(/^```json\s*/i, '')
      .replace(/```$/, '')
      .trim();

    try {
      return JSON.parse(cleaned);
    } catch (error) {
      this.logger.error('Failed to parse JSON:', error);
      throw new Error('Invalid JSON format in AI response');
    }
  }

  private async generatePrompt(number: number, usedHeroes: string[] = [], usedActions: string[] = [], usedObjects: string[] = []): Promise<string> {
    let restrictions = '';
    
    if (usedHeroes.length > 0) {
      restrictions += `\nNIE UŻYWAJ tych bohaterów (już używane): ${usedHeroes.join(', ')}`;
    }
    
    if (usedActions.length > 0) {
      restrictions += `\nNIE UŻYWAJ tych działań (już używane): ${usedActions.join(', ')}`;
    }
    
    if (usedObjects.length > 0) {
      restrictions += `\nNIE UŻYWAJ tych przedmiotów (już używane): ${usedObjects.join(', ')}`;
    }

    return `Stwórz proste i łatwe do zapamiętania skojarzenie dla liczby ${number} dla dzieci w wieku 6-12 lat w formacie "Bohater — Działanie — Przedmiot".
        Wymagania dla dzieci:
        - Bohater: znana postać z bajek, kreskówek, gier lub prostych historii (np. Królewna Śnieżka, Batman, Elsa, Spiderman, Myszka Miki)
        - Działanie: proste, aktywne, łatwe do wyobrażenia (np. je, śpi, biega, śpiewa, tańczy, rysuje)
        - Przedmiot: codzienny, rozpoznawalny, wizualny (np. jabłko, kredka, piłka, książka, lody)
        - Skojarzenie powinno być zabawne, kolorowe i łatwe do zapamiętania
        - Powinno wizualnie przypominać kształt liczby ${number} lub być z nią związane
        - Użyj prostych słów, które dzieci znają
        ${restrictions}
        - Odpowiedź ściśle w JSON:
        {
            "hero": "...",
            "action": "...",
            "object": "...",
            "explanation": "..."
        }`;
  }

  private async callOpenAI(prompt: string): Promise<AssociationResponse> {
    const response = await this.openApiService.post<any>('/v1/chat/completions', {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a creative assistant that generates simple, memorable number associations for children aged 6-12. Create fun, colorful associations using familiar characters from cartoons, movies, and stories. Use simple words and actions that children can easily understand and remember. Respond only with valid JSON, without markdown or formatting.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const message = response.choices?.[0]?.message?.content;
    if (!message) {
      throw new Error('Empty response from OpenAI');
    }

    return this.extractJsonFromMarkdown(message);
  }

  async generateAssociation(number: number): Promise<NumberAssociation> {
    const maxAttempts = 5;
    let attempts = 0;

    // Get all existing values from database at the start
    const existingAssociations = await this.numberAssociationRepository.find({
      select: ['hero', 'action', 'object']
    });

    const usedHeroes = existingAssociations.map(a => a.hero).filter(Boolean);
    const usedActions = existingAssociations.map(a => a.action).filter(Boolean);
    const usedObjects = existingAssociations.map(a => a.object).filter(Boolean);

    this.logger.log(`🔍 Found ${usedHeroes.length} existing heroes, ${usedActions.length} actions, ${usedObjects.length} objects in database`);

    while (attempts < maxAttempts) {
      try {
        const prompt = await this.generatePrompt(number, usedHeroes, usedActions, usedObjects);
        const content = await this.callOpenAI(prompt);
        
        this.logger.debug('Generated association content:', content);

        // Check for duplicates before saving
        const existingHero = await this.numberAssociationRepository.findOne({
          where: { hero: content.hero }
        });
        
        const existingAction = await this.numberAssociationRepository.findOne({
          where: { action: content.action }
        });
        
        const existingObject = await this.numberAssociationRepository.findOne({
          where: { object: content.object }
        });

        if (existingHero || existingAction || existingObject) {
          this.logger.warn(`❌ Duplicate found for number ${number}, attempt ${attempts + 1}:`);
          if (existingHero) {
            this.logger.warn(`   Hero "${content.hero}" already exists (ID: ${existingHero.id})`);
            usedHeroes.push(content.hero);
          }
          if (existingAction) {
            this.logger.warn(`   Action "${content.action}" already exists (ID: ${existingAction.id})`);
            usedActions.push(content.action);
          }
          if (existingObject) {
            this.logger.warn(`   Object "${content.object}" already exists (ID: ${existingObject.id})`);
            usedObjects.push(content.object);
          }
          
          attempts++;
          continue;
        }

        await this.numberAssociationRepository.update(
          { number },
          { is_primary: false }
        );

        const association = this.numberAssociationRepository.create({
          number,
          ...content,
          is_primary: true,
        });

        const saved = await this.numberAssociationRepository.save(association);
        this.logger.log(`✅ Created new association for number ${number} after ${attempts + 1} attempts:`);
        this.logger.log(`   Hero: "${saved.hero}"`);
        this.logger.log(`   Action: "${saved.action}"`);
        this.logger.log(`   Object: "${saved.object}"`);
        this.logger.log(`   Explanation: "${saved.explanation}"`);
        this.logger.log(`   ID: ${saved.id}`);

        return saved;
      } catch (error) {
        if (error.code === '23505') { // Unique constraint violation
          this.logger.warn(`Unique constraint violation for number ${number}, attempt ${attempts + 1}`);
          attempts++;
          continue;
        }
        
        this.logger.error(`Failed to generate association for number ${number}:`, error);
        throw new Error(`Failed to generate association: ${error.message}`);
      }
    }

    throw new Error(`Failed to generate unique association for number ${number} after ${maxAttempts} attempts`);
  }

  async getAssociation(number: number): Promise<NumberAssociation | null> {
    return this.numberAssociationRepository.findOne({
      where: { number, is_primary: true },
    });
  }

  async updateRating(number: number, rating: number): Promise<NumberAssociation> {
    const association = await this.numberAssociationRepository.findOne({
      where: { number },
    });

    if (!association) {
      throw new Error('Association not found');
    }

    const newTotalVotes = association.total_votes + 1;
    const newRating = ((association.rating * association.total_votes) + rating) / newTotalVotes;

    association.rating = newRating;
    association.total_votes = newTotalVotes;

    return this.numberAssociationRepository.save(association);
  }

  async generateAllAssociations(): Promise<number> {
    this.logger.log('Starting generation of next 30 associations (or until number 99)');
    
    // Сначала получаем все существующие числа в базе данных
    const existingNumbers = await this.numberAssociationRepository
      .createQueryBuilder('association')
      .select('DISTINCT association.number')
      .where('association.is_primary = :isPrimary', { isPrimary: true })
      .orderBy('association.number', 'ASC')
      .getRawMany();

    const existingNumberSet = new Set(existingNumbers.map(item => item.number));
    this.logger.log(`Found ${existingNumberSet.size} existing associations in database`);
    this.logger.log(`Existing numbers: ${Array.from(existingNumberSet).sort((a, b) => a - b).join(', ')}`);
    
    let successCount = 0;
    let skippedCount = 0;
    const errors: string[] = [];
    const maxToGenerate = 30; // Generate up to 30 numbers

    // Find the next 30 numbers that don't have associations (or until 99)
    const numbersToGenerate: number[] = [];
    for (let number = 0; number <= 99 && numbersToGenerate.length < maxToGenerate; number++) {
      if (!existingNumberSet.has(number)) {
        numbersToGenerate.push(number);
      }
    }

    this.logger.log(`Will generate associations for numbers: ${numbersToGenerate.join(', ')}`);
    this.logger.log(`Numbers to generate count: ${numbersToGenerate.length}`);

    for (const number of numbersToGenerate) {
      try {
        this.logger.log(`Generating association for number ${number}...`);
        await this.generateAssociation(number);
        successCount++;
        this.logger.log(`Successfully generated association for number ${number}`);
        
        // Небольшая задержка между запросами к API
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        const errorMsg = `Failed to generate association for number ${number}: ${error.message}`;
        this.logger.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    this.logger.log(`Generated ${successCount} new associations. Errors: ${errors.length}`);
    
    if (errors.length > 0) {
      this.logger.warn('Some associations failed to generate:', errors);
    }

    return successCount;
  }

  async getAllPrimaryAssociations(): Promise<Partial<NumberAssociation>[]> {
    console.log('Getting all primary associations...');
    try {
      const result = await this.numberAssociationRepository.find({
        where: { is_primary: true },
        order: { number: 'ASC' },
        select: ['number', 'hero', 'action', 'object'],
      });
      console.log('Found associations:', result.length);
      console.log('First association:', result[0]);
      return result;
    } catch (error) {
      console.error('Error in getAllPrimaryAssociations:', error);
      throw error;
    }
  }

  async checkAndRegenerateDuplicates(): Promise<{
    duplicates: Array<{ number: number; hero: string; action: string; object: string }>;
    regenerated: number[];
    message: string;
  }> {
    this.logger.log('Checking for duplicate associations...');
    
    let duplicates: Array<{ number: number; hero: string; action: string; object: string }> = [];
    let regenerated: number[] = [];
    let hasDuplicates = true;
    let iteration = 0;
    const maxIterations = 10; // Защита от бесконечного цикла

    // Повторяем процесс до тех пор, пока не останется дубликатов
    while (hasDuplicates && iteration < maxIterations) {
      iteration++;
      this.logger.log(`Duplicate check iteration ${iteration}`);
      
      // Получаем все primary ассоциации
      const associations = await this.numberAssociationRepository.find({
        where: { is_primary: true },
        order: { number: 'ASC' },
      });

      const seen = new Map<string, number[]>();
      hasDuplicates = false;

      // Ищем дубликаты по каждой части отдельно (hero, action, object)
      const heroMap = new Map<string, number[]>();
      const actionMap = new Map<string, number[]>();
      const objectMap = new Map<string, number[]>();

      for (const association of associations) {
        // Группируем по hero
        if (heroMap.has(association.hero)) {
          heroMap.get(association.hero)!.push(association.number);
        } else {
          heroMap.set(association.hero, [association.number]);
        }

        // Группируем по action
        if (actionMap.has(association.action)) {
          actionMap.get(association.action)!.push(association.number);
        } else {
          actionMap.set(association.action, [association.number]);
        }

        // Группируем по object
        if (objectMap.has(association.object)) {
          objectMap.get(association.object)!.push(association.number);
        } else {
          objectMap.set(association.object, [association.number]);
        }
      }

      // Находим дубликаты по каждой части и перегенерируем
      const duplicateNumbers = new Set<number>();

      // Проверяем дубликаты по hero
      for (const [hero, numbers] of heroMap.entries()) {
        if (numbers.length > 1) {
          hasDuplicates = true;
          if (iteration === 1) {
            duplicates.push({ number: numbers[0], hero, action: '', object: '' });
          }
          numbers.forEach(num => duplicateNumbers.add(num));
        }
      }

      // Проверяем дубликаты по action
      for (const [action, numbers] of actionMap.entries()) {
        if (numbers.length > 1) {
          hasDuplicates = true;
          if (iteration === 1) {
            duplicates.push({ number: numbers[0], hero: '', action, object: '' });
          }
          numbers.forEach(num => duplicateNumbers.add(num));
        }
      }

      // Проверяем дубликаты по object
      for (const [object, numbers] of objectMap.entries()) {
        if (numbers.length > 1) {
          hasDuplicates = true;
          if (iteration === 1) {
            duplicates.push({ number: numbers[0], hero: '', action: '', object });
          }
          numbers.forEach(num => duplicateNumbers.add(num));
        }
      }

      // Перегенерируем все числа с дубликатами
      for (const number of duplicateNumbers) {
        try {
          this.logger.log(`Regenerating association for number ${number} (has duplicate hero/action/object)`);
          await this.generateAssociation(number);
          regenerated.push(number);
          
          // Задержка между запросами
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (error) {
          this.logger.error(`Failed to regenerate association for number ${number}:`, error);
        }
      }
    }

    const message = duplicates.length > 0 
      ? `Found ${duplicates.length} duplicate patterns, regenerated ${regenerated.length} associations after ${iteration} iterations`
      : 'No duplicates found';

    this.logger.log(message);

    return {
      duplicates,
      regenerated,
      message,
    };
  }
} 
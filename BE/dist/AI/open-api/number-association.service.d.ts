import { OpenApiService } from './open-api.service';
import { Repository } from 'typeorm';
import { NumberAssociation } from '../../entities/number-association.entity';
export declare class NumberAssociationService {
    private readonly openApiService;
    private readonly numberAssociationRepository;
    private readonly logger;
    constructor(openApiService: OpenApiService, numberAssociationRepository: Repository<NumberAssociation>);
    private extractJsonFromMarkdown;
    private generatePrompt;
    private callOpenAI;
    generateAssociation(number: number): Promise<NumberAssociation>;
    getAssociation(number: number): Promise<NumberAssociation | null>;
    updateRating(number: number, rating: number): Promise<NumberAssociation>;
    generateAllAssociations(): Promise<number>;
    getAllPrimaryAssociations(): Promise<Partial<NumberAssociation>[]>;
    checkAndRegenerateDuplicates(): Promise<{
        duplicates: Array<{
            number: number;
            hero: string;
            action: string;
            object: string;
        }>;
        regenerated: number[];
        message: string;
    }>;
}

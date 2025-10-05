import { NumberAssociationService } from './number-association.service';
import { NumberAssociation } from '../../entities/number-association.entity';
import { ImageGenerationService } from './image-generation.service';
export declare class NumberAssociationController {
    private readonly numberAssociationService;
    private readonly imageGenerationService;
    constructor(numberAssociationService: NumberAssociationService, imageGenerationService: ImageGenerationService);
    generateAllAssociations(): Promise<{
        message: string;
        count: number;
    }>;
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
    generateAllImages(): Promise<{
        success: boolean;
        message: string;
        count: number;
        generatedFiles: string[];
    }>;
    getAssociationsWithImages(): Promise<{
        success: boolean;
        images: any[];
        total: number;
    }>;
    generateAssociation(number: number): Promise<NumberAssociation>;
    getAssociation(number: number): Promise<NumberAssociation | null>;
    rateAssociation(number: number, rating: number): Promise<NumberAssociation>;
}

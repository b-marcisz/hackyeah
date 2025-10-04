import { NumberAssociationService } from './number-association.service';
import { NumberAssociation } from '../../entities/number-association.entity';
export declare class NumberAssociationController {
    private readonly numberAssociationService;
    constructor(numberAssociationService: NumberAssociationService);
    generateAssociation(number: number): Promise<NumberAssociation>;
    getAssociation(number: number): Promise<NumberAssociation | null>;
    rateAssociation(id: number, rating: number): Promise<NumberAssociation>;
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
}

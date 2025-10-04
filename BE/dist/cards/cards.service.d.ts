import { Card } from './card.entity';
import { CreateCardDto } from './dto/create-card-dto';
import { Repository } from 'typeorm';
import { UpdateCardDto } from './dto/update-card-dto';
export declare class CardsService {
    private cardsRepository;
    constructor(cardsRepository: Repository<Card>);
    getCards(): Promise<Card[]>;
    getCardById(id: string): Promise<Card>;
    createCard(createCardDto: CreateCardDto): Promise<Card>;
    updateCard(id: string, updateCardDto: UpdateCardDto): Promise<Card>;
    deleteCard(id: string): Promise<void>;
}

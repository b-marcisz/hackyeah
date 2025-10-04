import { CardsService } from './cards.service';
import { Card } from './card.entity';
import { CreateCardDto } from './dto/create-card-dto';
import { UpdateCardDto } from './dto/update-card-dto';
export declare class CardsController {
    private readonly cardsService;
    constructor(cardsService: CardsService);
    getCards(): Promise<Card[]>;
    getCardById(id: string): Promise<Card>;
    createCard(createCardDto: CreateCardDto): Promise<Card>;
    updateCard(id: string, updateCardDto: UpdateCardDto): Promise<Card>;
    deleteCard(id: string): Promise<void>;
}

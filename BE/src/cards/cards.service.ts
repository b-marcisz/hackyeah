import { Injectable, NotFoundException } from '@nestjs/common';
import { Card} from './card.entity';
import { CreateCardDto } from './dto/create-card-dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { v7 as uuid } from 'uuid';
import { UpdateCardDto } from './dto/update-card-dto';


@Injectable()
export class CardsService {
    constructor (
        @InjectRepository(Card)
        private cardsRepository : Repository<Card>
    ){}
    async getCards() : Promise<Card[]>{
        return this.cardsRepository.find();
    }

    async getCardById(id : string) : Promise <Card>{
        const card = await this.cardsRepository.findOne({where : {id}});
        if(!card){
            throw new NotFoundException(`Card with id ${id} not found`);
        }
        return card;
    }
  

    async createCard(createCardDto: CreateCardDto) : Promise<Card>{ 
        const {title, description} = createCardDto;
        const card = this.cardsRepository.create({
            title,
            description,
        })
      return  await this.cardsRepository.save(card);

    }
    async updateCard(id : string , updateCardDto : UpdateCardDto) : Promise <Card>{
    const {title,description} = updateCardDto;
        const card = await this.getCardById(id);
        if(title !== undefined){
            card.title = title;
        }
        if(description !== undefined){
            card.description = description;
        }
        return await this.cardsRepository.save(card);

    }
    async deleteCard(id : string) :Promise<void>{
    const result = await this.cardsRepository.delete({id});
    if(!result.affected){
        throw new NotFoundException(`Card with id ${id} not found`);
    }
    }
}

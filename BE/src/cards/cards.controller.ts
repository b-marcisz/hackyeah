import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CardsService } from './cards.service';
import { Card } from './card.entity';
import { CreateCardDto } from './dto/create-card-dto';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { UpdateCardDto } from './dto/update-card-dto';

@ApiTags('cards')
@Controller('cards')
export class CardsController {
    constructor(private readonly cardsService : CardsService){}
    
    @Get()
    @ApiOperation({ summary: 'Get all cards' })
    @ApiResponse({ status: 200, description: 'Cards retrieved successfully', type: [Card] })
    getCards() : Promise<Card[]>{
      return this.cardsService.getCards();
    }
    
    @Get(':id')
    @ApiOperation({ summary: 'Get card by ID' })
    @ApiParam({ name: 'id', description: 'Card ID' })
    @ApiResponse({ status: 200, description: 'Card retrieved successfully', type: Card })
    @ApiResponse({ status: 404, description: 'Card not found' })
    getCardById(@Param('id') id : string) : Promise<Card>{ 
      return this.cardsService.getCardById(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new card' })
    @ApiResponse({ status: 201, description: 'Card created successfully', type: Card })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @UsePipes(new ValidationPipe({ whitelist: true }))
    createCard(@Body() createCardDto: CreateCardDto): Promise<Card> {
      return this.cardsService.createCard(createCardDto);
    }
    
    @Patch(':id')
    @ApiOperation({ summary: 'Update a card' })
    @ApiParam({ name: 'id', description: 'Card ID' })
    @ApiResponse({ status: 200, description: 'Card updated successfully', type: Card })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 404, description: 'Card not found' })
    @UsePipes(new ValidationPipe({ whitelist: true }))
    updateCard(@Param('id') id :string, @Body() updateCardDto : UpdateCardDto) : Promise<Card>{
      return this.cardsService.updateCard(id, updateCardDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a card' })
    @ApiParam({ name: 'id', description: 'Card ID' })
    @ApiResponse({ status: 200, description: 'Card deleted successfully' })
    @ApiResponse({ status: 404, description: 'Card not found' })
    deleteCard(@Param('id') id :string) : Promise<void>{
      return this.cardsService.deleteCard(id);
    }
}

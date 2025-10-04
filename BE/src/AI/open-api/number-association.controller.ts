import { Controller, Get, Post, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { NumberAssociationService } from './number-association.service';
import { NumberAssociation } from '../../entities/number-association.entity';

@Controller('number-associations')
export class NumberAssociationController {
  constructor(private readonly numberAssociationService: NumberAssociationService) {}

  @Post(':number/generate')
  async generateAssociation(
    @Param('number') number: number,
  ): Promise<NumberAssociation> {
    console.log("genere ...");
    try {
        const result = await this.numberAssociationService.generateAssociation(number);
      return result;
    } catch (error) {
      throw new HttpException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':number')
  async getAssociation(
    @Param('number') number: number,
  ): Promise<NumberAssociation | null> {
    try {
      const association = await this.numberAssociationService.getAssociation(number);
      if (!association) {
        throw new HttpException(
          'Association not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return association;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':id/rate')
  async rateAssociation(
    @Param('id') id: number,
    @Body('rating') rating: number,
  ): Promise<NumberAssociation> {
    try {
      if (rating < 1 || rating > 5) {
        throw new HttpException(
          'Rating must be between 1 and 5',
          HttpStatus.BAD_REQUEST,
        );
      }
      return await this.numberAssociationService.updateRating(id, rating);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('generate-all')
  async generateAllAssociations(): Promise<{ message: string; count: number }> {
    try {
      const result = await this.numberAssociationService.generateAllAssociations();
      return {
        message: 'Successfully generated associations for numbers 0-99',
        count: result,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('all/primary')
  async getAllPrimaryAssociations(): Promise<NumberAssociation[]> {
    try {
      return await this.numberAssociationService.getAllPrimaryAssociations();
    } catch (error) {
      throw new HttpException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('check-duplicates')
  async checkAndRegenerateDuplicates(): Promise<{
    duplicates: Array<{ number: number; hero: string; action: string; object: string }>;
    regenerated: number[];
    message: string;
  }> {
    try {
      return await this.numberAssociationService.checkAndRegenerateDuplicates();
    } catch (error) {
      throw new HttpException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 
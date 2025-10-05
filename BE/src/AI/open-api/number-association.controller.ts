import { Controller, Get, Post, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { NumberAssociationService } from './number-association.service';
import { NumberAssociation } from '../../entities/number-association.entity';
import { ImageGenerationService } from './image-generation.service';

@Controller('number-associations')
export class NumberAssociationController {
  constructor(
    private readonly numberAssociationService: NumberAssociationService,
    private readonly imageGenerationService: ImageGenerationService,
  ) {
    console.log('NumberAssociationController constructor called');
  }

  @Post('generate-all')
  async generateAllAssociations(): Promise<{ message: string; count: number }> {
    try {
      const result = await this.numberAssociationService.generateAllAssociations();
      return {
        message: 'Successfully generated next 10 associations',
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
  async getAllPrimaryAssociations(): Promise<Partial<NumberAssociation>[]> {
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

  @Post('generate-images')
  async generateAllImages(): Promise<{
    success: boolean;
    message: string;
    count: number;
    generatedFiles: string[];
  }> {
    try {
      const associations = await this.numberAssociationService.getAllPrimaryAssociations();
      
      // Filter out associations with missing required fields
      const validAssociations = associations.filter(assoc => 
        assoc.number !== undefined && 
        assoc.hero !== undefined && 
        assoc.action !== undefined && 
        assoc.object !== undefined
      ).map(assoc => ({
        number: assoc.number!,
        hero: assoc.hero!,
        action: assoc.action!,
        object: assoc.object!
      }));
      
      const generatedFiles = await this.imageGenerationService.generateAllAssociationImages(validAssociations);

      return {
        success: true,
        message: `Generated images for ${validAssociations.length} associations`,
        count: validAssociations.length * 3, // 3 images per association
        generatedFiles,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to generate all images',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('with-images')
  async getAssociationsWithImages(): Promise<{
    success: boolean;
    images: any[];
    total: number;
  }> {
    try {
      console.log("check it....")
      console.log('Getting associations with images...');
      const associations = await this.numberAssociationService.getAllPrimaryAssociations();
      console.log('Found associations:', associations.length);
      
      const imageList: any[] = [];

      for (const assoc of associations) {
        // Skip associations with missing required fields
        if (assoc.number === undefined || assoc.hero === undefined || 
            assoc.action === undefined || assoc.object === undefined  || assoc.id === undefined ) {
          console.log('Skipping association with missing fields:', assoc);
          continue;
        }

        console.log('Processing association:', assoc.number);
        
        const heroPath = this.imageGenerationService.getImagePath(assoc.number, 'hero');
        const actionPath = this.imageGenerationService.getImagePath(assoc.number, 'action');
        const objectPath = this.imageGenerationService.getImagePath(assoc.number, 'object');

        imageList.push({
          associationId: assoc.number,
          hero: assoc.hero,
          action: assoc.action,
          object: assoc.object,
          images: {
            hero: heroPath,
            action: actionPath,
            object: objectPath,
          },
        });
      }

      console.log('Returning image list with', imageList.length, 'items');
      return {
        success: true,
        images: imageList,
        total: imageList.length,
      };
    } catch (error) {
      console.error('Error in getAssociationsWithImages:', error);
      throw new HttpException(
        error.message || 'Failed to list images',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  
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
    console.log("get association....")
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

  @Post(':number/rate')
  async rateAssociation(
    @Param('number') number: number,
    @Body('rating') rating: number,
  ): Promise<NumberAssociation> {
    try {
      if (rating < 1 || rating > 5) {
        throw new HttpException(
          'Rating must be between 1 and 5',
          HttpStatus.BAD_REQUEST,
        );
      }
      return await this.numberAssociationService.updateRating(number, rating);
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

 
} 
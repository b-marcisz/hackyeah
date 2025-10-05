import { Controller, Post, Get, Param, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ImageGenerationService } from './image-generation.service';
import { NumberAssociationService } from './number-association.service';

@Controller('image-generation')
export class ImageGenerationController {
  constructor(
    private readonly imageGenerationService: ImageGenerationService,
    private readonly numberAssociationService: NumberAssociationService,
  ) {}

  @Post('generate/:associationId/:type')
  async generateImage(
    @Param('associationId') associationIdParam: string,
    @Param('type') type: 'hero' | 'action' | 'object',
    @Query('text') text: string,
  ) {
    try {
      if (!text) {
        throw new HttpException('Text parameter is required', HttpStatus.BAD_REQUEST);
      }

      const associationId = parseInt(associationIdParam, 10);
      if (isNaN(associationId)) {
        throw new HttpException('Invalid associationId', HttpStatus.BAD_REQUEST);
      }

      const imagePath = await this.imageGenerationService.generateAssociationImage(
        associationId,
        type,
        text,
      );

      return {
        success: true,
        imagePath,
        message: `Image generated for ${type}: ${text}`,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to generate image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('generate-all')
  async generateAllImages() {
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

  @Get('check/:associationId/:type')
  async checkImageExists(
    @Param('associationId') associationIdParam: string,
    @Param('type') type: 'hero' | 'action' | 'object',
  ) {
    try {
      const associationId = parseInt(associationIdParam, 10);
      if (isNaN(associationId)) {
        throw new HttpException('Invalid associationId', HttpStatus.BAD_REQUEST);
      }

      const imagePath = this.imageGenerationService.getImagePath(associationId, type);
      
      return {
        exists: !!imagePath,
        imagePath,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to check image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('list')
  async listAllImages() {
    try {
      const associations = await this.numberAssociationService.getAllPrimaryAssociations();
      const imageList: any[] = [];

      for (const assoc of associations) {
        // Skip associations with missing required fields
        if (assoc.number === undefined || assoc.hero === undefined || 
            assoc.action === undefined || assoc.object === undefined) {
          continue;
        }

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

      return {
        success: true,
        images: imageList,
        total: imageList.length,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to list images',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

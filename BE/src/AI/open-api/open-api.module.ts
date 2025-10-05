import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OpenApiService } from './open-api.service';
import { OpenApiController } from './open-api.controller';
import { NumberAssociationController } from './number-association.controller';
import { NumberAssociationService } from './number-association.service';
import { ImageGenerationController } from './image-generation.controller';
import { ImageGenerationService } from './image-generation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NumberAssociation } from '../../entities/number-association.entity';
import { UserProgress } from '../../entities/user-progress.entity';
import { UserProgressService } from './user-progress.service';
import { UserProgressController } from './user-progress.controller';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([NumberAssociation, UserProgress]),
  ],
  controllers: [OpenApiController, NumberAssociationController, ImageGenerationController, UserProgressController],
  providers: [OpenApiService, NumberAssociationService, ImageGenerationService, UserProgressService],
  exports: [OpenApiService, NumberAssociationService, ImageGenerationService, UserProgressService, TypeOrmModule],
})
export class OpenApiModule {} 
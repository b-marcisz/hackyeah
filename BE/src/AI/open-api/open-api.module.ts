import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OpenApiService } from './open-api.service';
import { OpenApiController } from './open-api.controller';
import { NumberAssociationController } from './number-association.controller';
import { NumberAssociationService } from './number-association.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NumberAssociation } from '../../entities/number-association.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([NumberAssociation]),
  ],
  controllers: [OpenApiController, NumberAssociationController],
  providers: [OpenApiService, NumberAssociationService],
  exports: [OpenApiService, NumberAssociationService,TypeOrmModule],
})
export class OpenApiModule {} 
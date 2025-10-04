"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const cards_module_1 = require("./cards/cards.module");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const open_api_module_1 = require("./AI/open-api/open-api.module");
const number_association_entity_1 = require("./entities/number-association.entity");
const games_module_1 = require("./games/games.module");
const game_entity_1 = require("./games/game.entity");
const card_entity_1 = require("./cards/card.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            cards_module_1.CardsModule,
            open_api_module_1.OpenApiModule,
            games_module_1.GamesModule,
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const config = {
                        type: 'postgres',
                        host: configService.get('DB_HOST'),
                        port: configService.get('DB_PORT'),
                        username: configService.get('DB_USERNAME'),
                        password: configService.get('DB_PASSWORD'),
                        database: configService.get('DB_DATABASE'),
                        entities: [number_association_entity_1.NumberAssociation, card_entity_1.Card, game_entity_1.Game],
                        autoLoadEntities: false,
                        synchronize: false,
                    };
                    console.log('📡 DB CONFIG:', config);
                    return config;
                },
            }),
        ]
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
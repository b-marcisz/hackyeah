"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenApiModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const open_api_service_1 = require("./open-api.service");
const open_api_controller_1 = require("./open-api.controller");
const number_association_controller_1 = require("./number-association.controller");
const number_association_service_1 = require("./number-association.service");
const typeorm_1 = require("@nestjs/typeorm");
const number_association_entity_1 = require("../../entities/number-association.entity");
let OpenApiModule = class OpenApiModule {
};
exports.OpenApiModule = OpenApiModule;
exports.OpenApiModule = OpenApiModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            typeorm_1.TypeOrmModule.forFeature([number_association_entity_1.NumberAssociation]),
        ],
        controllers: [open_api_controller_1.OpenApiController, number_association_controller_1.NumberAssociationController],
        providers: [open_api_service_1.OpenApiService, number_association_service_1.NumberAssociationService],
        exports: [open_api_service_1.OpenApiService, number_association_service_1.NumberAssociationService, typeorm_1.TypeOrmModule],
    })
], OpenApiModule);
//# sourceMappingURL=open-api.module.js.map
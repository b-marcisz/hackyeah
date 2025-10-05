"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenApiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
let OpenApiService = class OpenApiService {
    configService;
    apiClient;
    token = null;
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.get('OPENAI_API_KEY');
        console.log('🔑 OpenAI API Key loaded:', apiKey ? 'YES' : 'NO');
        console.log('🔑 API Key value:', apiKey ? `${apiKey.substring(0, 10)}...` : 'undefined');
        this.apiClient = axios_1.default.create({
            baseURL: this.configService.get('OPEN_API_BASE_URL') ?? 'https://api.openai.com',
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        this.apiClient.interceptors.request.use((config) => {
            config.headers.Authorization = `Bearer ${this.configService.get('OPENAI_API_KEY')}`;
            console.log('➡️ [Request]', config.method?.toUpperCase(), config.url);
            console.log('Headers:', config.headers);
            console.log('Body:', config.data);
            return config;
        });
        this.apiClient.interceptors.response.use((response) => {
            console.log('✅ [Response]', response.status, response.config.url);
            console.log('Data:', response.data);
            return response;
        }, (error) => {
            if (error.response) {
                console.error('❌ [Error Response]', error.response.status, error.response.config.url);
                console.error('Data:', error.response.data);
            }
            else if (error.request) {
                console.error('❌ [No Response]', error.request);
            }
            else {
                console.error('❌ [Request Error]', error.message);
            }
            return Promise.reject(error);
        });
    }
    setToken(token) {
        this.token = token;
    }
    clearToken() {
        this.token = null;
    }
    async get(endpoint, params) {
        try {
            const response = await this.apiClient.get(endpoint, { params });
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async post(endpoint, data) {
        try {
            console.log(":::::");
            console.log('Request URL:', this.apiClient.getUri({ url: 'v1/chat/completions' }));
            const response = await this.apiClient.post(endpoint, data);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    handleError(error) {
        if (error.response) {
            throw new Error(`API Error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
        }
        else if (error.request) {
            throw new Error('No response received from API');
        }
        else {
            throw new Error(`Request Error: ${error.message}`);
        }
    }
};
exports.OpenApiService = OpenApiService;
exports.OpenApiService = OpenApiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], OpenApiService);
//# sourceMappingURL=open-api.service.js.map
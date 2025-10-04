import { ConfigService } from '@nestjs/config';
export declare class OpenApiService {
    private readonly configService;
    private readonly apiClient;
    private token;
    constructor(configService: ConfigService);
    setToken(token: string): void;
    clearToken(): void;
    get<T>(endpoint: string, params?: Record<string, any>): Promise<T>;
    post<T>(endpoint: string, data: any): Promise<T>;
    private handleError;
}

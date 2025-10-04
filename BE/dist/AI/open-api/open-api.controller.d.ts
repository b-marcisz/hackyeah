import { OpenApiService } from './open-api.service';
export declare class OpenApiController {
    private readonly openApiService;
    constructor(openApiService: OpenApiService);
    getData(token: string): Promise<unknown>;
    postData(token: string, data: any): Promise<unknown>;
}

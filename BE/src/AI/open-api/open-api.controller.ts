import { Controller, Get, Post, Body, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { OpenApiService } from './open-api.service';

@ApiTags('open-api')
@Controller('open-api')
export class OpenApiController {
  constructor(private readonly openApiService: OpenApiService) {}

  @Get()
  @ApiOperation({ summary: 'Get data from external API' })
  @ApiHeader({ name: 'authorization', description: 'Bearer token for authentication', required: false })
  @ApiResponse({ status: 200, description: 'Data retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'External API error' })
  async getData(@Headers('authorization') token: string) {
    if (token) {
      this.openApiService.setToken(token.replace('Bearer ', ''));
    }
    return this.openApiService.get('/');
  }

  @Post()
  @ApiOperation({ summary: 'Post data to external API' })
  @ApiHeader({ name: 'authorization', description: 'Bearer token for authentication', required: false })
  @ApiResponse({ status: 200, description: 'Data posted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'External API error' })
  async postData(
    @Headers('authorization') token: string,
    @Body() data: any,
  ) {
    if (token) {
      this.openApiService.setToken(token.replace('Bearer ', ''));
    }
    return this.openApiService.post('/', data);
  }
} 
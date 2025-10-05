import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class OpenApiService {
  private readonly apiClient: AxiosInstance;
  private token: string | null = null;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    console.log('🔑 OpenAI API Key loaded:', apiKey ? 'YES' : 'NO');
    console.log('🔑 API Key value:', apiKey ? `${apiKey.substring(0, 10)}...` : 'undefined');
    
    this.apiClient = axios.create({
      baseURL: this.configService.get<string>('OPEN_API_BASE_URL') ?? 'https://api.openai.com',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // this.apiClient.interceptors.request.use((config) => {
    //     config.headers.Authorization = `Bearer ${this.configService.get<string>('OPENAI_API_KEY')}`;
    //     return config;
    //   });
    // Add request interceptor for token
    this.apiClient.interceptors.request.use((config) => {
        config.headers.Authorization = `Bearer ${this.configService.get<string>('OPENAI_API_KEY')}`;
        console.log('➡️ [Request]', config.method?.toUpperCase(), config.url);
        console.log('Headers:', config.headers);
        console.log('Body:', config.data);
        return config;
      });
      
      this.apiClient.interceptors.response.use(
        (response) => {
          console.log('✅ [Response]', response.status, response.config.url);
          console.log('Data:', response.data);
          return response;
        },
        (error) => {
          if (error.response) {
            console.error('❌ [Error Response]', error.response.status, error.response.config.url);
            console.error('Data:', error.response.data);
          } else if (error.request) {
            console.error('❌ [No Response]', error.request);
          } else {
            console.error('❌ [Request Error]', error.message);
          }
          return Promise.reject(error);
        }
      );
  }

  /**
   * Set the authentication token
   * @param token The authentication token
   */
  setToken(token: string): void {
    this.token = token;
  }

  /**
   * Clear the current authentication token
   */
  clearToken(): void {
    this.token = null;
  }

  /**
   * Make a GET request to the OpenAPI
   * @param endpoint The API endpoint
   * @param params Optional query parameters
   */
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    try {
      const response = await this.apiClient.get<T>(endpoint, { params });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Make a POST request to the OpenAPI
   * @param endpoint The API endpoint
   * @param data The data to send
   */
  async post<T>(endpoint: string, data: any): Promise<T> {
    try {
        console.log(":::::");
        console.log('Request URL:', this.apiClient.getUri({ url: 'v1/chat/completions' }));
        
      const response = await this.apiClient.post<T>(endpoint, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Handle API errors
   * @param error The error object
   */
  private handleError(error: any): never {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(`API Error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response received from API');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(`Request Error: ${error.message}`);
    }
  }
}

import apiClient from '../client';
import { CreateAccountDto, CreateUserDto, AccountDto } from '../types';

export const accountsService = {
  /**
   * Create a new account
   */
  createAccount: async (dto: CreateAccountDto): Promise<AccountDto> => {
    const response = await apiClient.post<AccountDto>('/accounts', dto);
    return response.data;
  },

  /**
   * Get account by name with all users
   */
  getAccount: async (accountName: string): Promise<AccountDto> => {
    const response = await apiClient.get<AccountDto>(`/accounts/${accountName}`);
    return response.data;
  },

  /**
   * Add user to account
   */
  addUser: async (accountName: string, dto: CreateUserDto): Promise<any> => {
    const response = await apiClient.post(`/accounts/${accountName}/users`, dto);
    return response.data;
  },
};

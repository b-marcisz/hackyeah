import apiClient from '../client';
import { CreateAccountDto, CreateUserDto, UpdateUserDto, AccountDto, UserSessionDto } from '../types';

export const accountsService = {
  /**
   * Create a new account
   */
  createAccount: async (dto: CreateAccountDto): Promise<AccountDto> => {
    const response = await apiClient.post<AccountDto>('/accounts', dto);
    return response.data;
  },

  /**
   * Verify PIN/code for account
   * Endpoint: GET /accounts/{accountName}/check-code/{code}
   */
  verifyPin: async (accountName: string, pin: string): Promise<boolean> => {
    try {
      const response = await apiClient.get(`/accounts/${accountName}/check-code/${pin}`);
      return response.status === 200;
    } catch (error: any) {
      console.error('Error verifying PIN:', error);
      return false;
    }
  },

  /**
   * Login with PIN - find account by PIN
   *
   * IMPORTANT: Backend currently doesn't have an endpoint to find account by PIN alone.
   * Current endpoints require accountName in URL path:
   * - GET /accounts/{accountName}/check-code/{code}
   *
   * NEEDED: Backend should add POST /accounts/login endpoint:
   * - Request: { code: "1234" }
   * - Response: { accountName: "Jan", accountId: "uuid" }
   *
   * For now, we use hardcoded "Jan" and verify PIN against it.
   */
  loginWithPin: async (pin: string): Promise<{ accountName: string } | null> => {
    try {
      // Temporary solution: hardcoded account name
      const accountName = 'Jan';
      const isValid = await accountsService.verifyPin(accountName, pin);

      if (isValid) {
        return { accountName };
      }
      return null;
    } catch (error: any) {
      console.error('Error logging in with PIN:', error);
      return null;
    }
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
  addUser: async (accountName: string, dto: CreateUserDto, pin: string): Promise<any> => {
    const response = await apiClient.post(`/accounts/${accountName}/users`, { ...dto, code: pin });
    return response.data;
  },

  /**
   * Update user in account
   */
  updateUser: async (accountName: string, userId: string, dto: UpdateUserDto, pin: string): Promise<any> => {
    const response = await apiClient.patch(`/accounts/${accountName}/users/${userId}`, { ...dto, code: pin });
    return response.data;
  },

  /**
   * Delete user from account
   */
  deleteUser: async (accountName: string, userId: string): Promise<{ success: boolean }> => {
    const response = await apiClient.delete(`/accounts/${accountName}/users/${userId}`);
    return response.data;
  },

  /**
   * Create a new session for user
   * POST /accounts/{accountName}/users/{userId}/sessions
   */
  createSession: async (accountName: string, userId: string): Promise<UserSessionDto> => {
    const response = await apiClient.post<UserSessionDto>(`/accounts/${accountName}/users/${userId}/sessions`);
    return response.data;
  },

  /**
   * Get today's session for user
   * GET /accounts/{accountName}/users/{userId}/sessions/today
   */
  getTodaySession: async (accountName: string, userId: string): Promise<UserSessionDto | null> => {
    try {
      const response = await apiClient.get<UserSessionDto>(`/accounts/${accountName}/users/${userId}/sessions/today`);
      return response.data;
    } catch (error: any) {
      // If no session today, return null
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },
};

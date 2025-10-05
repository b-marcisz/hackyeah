import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Headers,
  HttpException,
  HttpStatus,
  Delete,
  Patch,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountDto } from './dto/account.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('accounts')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @ApiParam({ name: 'accountName', type: String, description: 'Account name' })
  @ApiResponse({
    status: 200,
    description: 'Return account with users',
    type: AccountDto,
  })
  @Get(':accountName')
  async getAccount(@Param('accountName') accountName: string): Promise<AccountDto> {
    const account = await this.accountsService.findByName(accountName);
    return {
      id: account.id,
      users: account.users,
    };
  }

  @ApiBearerAuth()
  @ApiParam({ name: 'accountName', type: String, description: 'Account name' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User created',
    type: CreateUserDto,
  })
  @ApiResponse({ status: 403, description: 'Unauthorized' })
  @Post(':accountName/users')
  addUser(
    @Param('accountName') accountName: string,
    @Body() createUserDto: CreateUserDto
  ) {
    return this.accountsService.addUser(accountName, createUserDto);
  }

  @Post()
  @ApiBody({ type: CreateAccountDto })
  @ApiResponse({ status: 201, description: 'Account created', type: AccountDto })
  async createAccount(@Body() dto: CreateAccountDto) {
    const account = await this.accountsService.createAccount(dto);
    return {
      id: account.id,
      users: account.users,
      code: account.code,
    };
  }

  @ApiOperation({ summary: 'Delete a user from an account' })
  @ApiParam({ name: 'accountName', type: String, description: 'Account name' })
  @ApiParam({ name: 'userId', type: String, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deleted', schema: { example: { success: true } } })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Delete(':accountName/users/:userId')
  async deleteUser(
    @Param('accountName') accountName: string,
    @Param('userId') userId: string,
  ) {
    const ok = await this.accountsService.deleteUser(accountName, userId);
    if (!ok) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return { success: true };
  }

  @Patch(':accountName/users/:userId')
  @ApiOperation({ summary: 'Update a user in an account' })
  @ApiParam({ name: 'accountName', type: String, description: 'Account name' })
  @ApiParam({ name: 'userId', type: String, description: 'User ID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUser(
    @Param('accountName') accountName: string,
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updated = await this.accountsService.updateUser(accountName, userId, updateUserDto);
    if (!updated) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return updated;
  }

  @Get(':accountName/check-code/:code')
  @ApiOperation({ summary: 'Check if code exists for any account' })
  @ApiParam({ name: 'accountName', type: String, description: 'Account name' })
  @ApiParam({ name: 'code', type: String, description: '4-digit code' })
  @ApiResponse({ status: 200, description: 'Code existence', schema: { example: { exists: true } } })
  async checkCode(
    @Param('accountName') accountName: string, @Param('code') code: string) {
    const exists = await this.accountsService.codeExists(accountName, code);
    return { exists };
  }

  @Post(':accountName/users/:userId/sessions')
  @ApiParam({ name: 'accountName', type: String, description: 'Account name' })
  @ApiResponse({ status: 200, description: 'Session created' })
  async createSession(
    @Param('accountName') accountName: string,
    @Param('userId') userId: string
  ) {
    const result = await this.accountsService.saveUserSession(accountName, userId);
    return result;
  }

  @Get(':accountName/users/:userId/sessions/today')
  @ApiParam({ name: 'accountName', type: String, description: 'Account name' })
  @ApiParam({ name: 'userId', type: String, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Session returned' })
  async getTodaySession(
    @Param('accountName') accountName: string,
    @Param('userId') userId: string
  ) {
    return this.accountsService.getUserSessionToday(accountName, userId);
  }

  @Patch('sessions/:sessionId')
  @ApiParam({ name: 'sessionId', type: String, description: 'Session ID' })
  @ApiBody({ schema: { type: 'object', properties: { totalMinutes: { type: 'number' } } } })
  @ApiResponse({ status: 200, description: 'Session updated' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async updateSession(
    @Param('sessionId') sessionId: string,
    @Body() body: { totalMinutes: number }
  ) {
    return this.accountsService.updateSessionTime(sessionId, body.totalMinutes);
  }

  @Post('sessions/:sessionId/extend')
  @ApiParam({ name: 'sessionId', type: String, description: 'Session ID' })
  @ApiBody({ schema: { type: 'object', properties: { additionalMinutes: { type: 'number' } } } })
  @ApiResponse({ status: 200, description: 'Session extended' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async extendSession(
    @Param('sessionId') sessionId: string,
    @Body() body: { additionalMinutes: number }
  ) {
    return this.accountsService.extendSessionTime(sessionId, body.additionalMinutes);
  }
}
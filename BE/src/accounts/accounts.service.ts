import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSession } from './entities/session.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserSession)
    private readonly userSessionRepository: Repository<UserSession>
  ) {}

  async findByName(accountName: string): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { name: accountName },
      relations: ['users'],
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    return account;
  }

  async addUser(accountName: string, userDto: CreateUserDto): Promise<User> {
    let account = await this.accountRepository.findOne({
      where: { name: accountName },
      relations: ['users'],
    });
    if (!account) {
      account = this.accountRepository.create({ name: accountName, users: [] });
      await this.accountRepository.save(account);
    }
    if (userDto.code != account.code) {
      throw new ForbiddenException();
    }
    const user = this.userRepository.create({ ...userDto, account });
    await this.userRepository.save(user);
    return user;
  }

  async createAccount(dto: CreateAccountDto): Promise<Account> {
    const exists = await this.accountRepository.findOne({ where: [{ name: dto.name }, { code: dto.code }] });
    if (exists) throw new ConflictException('Account with this name or code already exists');
    const acc = this.accountRepository.create({ name: dto.name, code: dto.code, users: [] });
    return this.accountRepository.save(acc);
  }

  async deleteUser(accountName: string, userId: string): Promise<boolean> {
    const account = await this.accountRepository.findOne({
      where: { name: accountName },
      relations: ['users'],
    });
    if (!account) {
      return false;
    }
    const user = account.users.find(u => u.id === userId);
    if (!user) {
      return false;
    }

    // Delete all sessions for this user first to avoid foreign key constraint violation
    await this.userSessionRepository.delete({ user: { id: userId } });

    // Now delete the user
    await this.userRepository.delete(userId);
    return true;
  }

  async updateUser(accountName: string, userId: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    const account = await this.accountRepository.findOne({
      where: { name: accountName },
      relations: ['users'],
    });
    if (!account) return null;
    if (updateUserDto.code != account.code) {
      throw new ForbiddenException();
    }
    const user = account.users.find(u => u.id === userId);
    if (!user) return null;

    Object.assign(user, updateUserDto);
    await this.userRepository.save(user);
    return user;
  }

  async codeExists(accountName: string, code: string): Promise<boolean> {
    const account = await this.accountRepository.findOne({ where: { code, name: accountName } });
    return !!account;
  }

  async saveUserSession(accountName: string, userId: string): Promise<UserSession> {
    const account = await this.accountRepository.findOne({
      where: { name: accountName },
      relations: ['users'],
    });
    if (!account) throw new NotFoundException('Account not found');
    const user = account.users.find(u => u.id === userId);
    if (!user) throw new NotFoundException('User not found');

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const existing = await this.userSessionRepository.findOne({
      where: { user: { id: userId }, date: today },
    });

    if (existing) return existing;

    const session = this.userSessionRepository.create({
      user,
      date: today,
      startTime: new Date(),
      totalMinutes: 0
    });
    return await this.userSessionRepository.save(session);
  }

  async getUserSessionToday(accountName: string, userId: string): Promise<UserSession | null> {
    const account = await this.accountRepository.findOne({
      where: { name: accountName },
      relations: ['users'],
    });
    if (!account) throw new NotFoundException('Account not found');
    const user = account.users.find(u => u.id === userId);
    if (!user) throw new NotFoundException('User not found');

    const today = new Date().toISOString().split('T')[0];
    return await this.userSessionRepository.findOne({
      where: { user: { id: userId }, date: today },
    });
  }

  async updateSessionTime(sessionId: string, totalMinutes: number): Promise<UserSession> {
    const session = await this.userSessionRepository.findOne({
      where: { id: sessionId }
    });
    if (!session) throw new NotFoundException('Session not found');

    session.totalMinutes = totalMinutes;
    session.endTime = new Date();

    return await this.userSessionRepository.save(session);
  }
}
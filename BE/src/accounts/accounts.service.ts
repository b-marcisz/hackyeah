import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
}
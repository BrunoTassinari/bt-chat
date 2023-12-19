import { PrismaClient } from '@prisma/client';
import { User } from 'User/UserEntity';
import { IUsersRepository } from '../../src/User/IUsersRepository';

export class UsersPrismaRepository implements IUsersRepository {
  prisma = new PrismaClient();

  async create({ id, name, username, password }: User): Promise<void> {
    await this.prisma.user.create({
      data: {
        id,
        name,
        username,
        password,
      },
    });
  }

  async findByUsername(username: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (user) return true;

    return false;
  }
}

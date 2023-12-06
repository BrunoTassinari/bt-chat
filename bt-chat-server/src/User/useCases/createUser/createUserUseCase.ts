import { UsersFactory } from 'User/UsersFactory';
import { CreateUserDTO } from './createUserDTO';
import { UsersPrismaRepository } from '../../../../prisma/implementations/users.repository.prisma';

export class CreateUserUseCase {
  constructor(private usersRepository: UsersPrismaRepository) {}

  async execute(data: CreateUserDTO): Promise<void> {
    const UserEntity = UsersFactory.create(data);

    await this.usersRepository.create(UserEntity);
  }
}

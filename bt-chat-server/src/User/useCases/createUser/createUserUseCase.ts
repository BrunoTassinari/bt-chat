import { UsersFactory } from 'User/UsersFactory';
import { ExceptionFactory } from 'Exceptions/ExceptionsFactory';
import { CreateUserDTO } from './createUserDTO';
import { UsersPrismaRepository } from '../../../../prisma/implementations/users.repository.prisma';

export class CreateUserUseCase {
  constructor(private usersRepository: UsersPrismaRepository) {}

  async execute(data: CreateUserDTO): Promise<void> {
    const userAlreadyExists = await this.usersRepository.findByUsername(
      data.username,
    );

    if (userAlreadyExists)
      throw ExceptionFactory.newException(409, 'User already exists');

    const UserEntity = UsersFactory.create(data);

    await this.usersRepository.create(UserEntity);
  }
}

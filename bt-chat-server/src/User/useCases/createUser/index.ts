import { UsersPrismaRepository } from '../../../../prisma/implementations/users.repository.prisma';
import { CreateUserController } from './createUserController';
import { CreateUserUseCase } from './createUserUseCase';

const usersPrismaRepository = new UsersPrismaRepository();
const createUserUseCase = new CreateUserUseCase(usersPrismaRepository);
const createUserController = new CreateUserController(createUserUseCase);

export { createUserUseCase, createUserController };

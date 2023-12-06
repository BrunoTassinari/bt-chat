import { User } from './UserEntity';

export interface IUsersRepository {
  create: (data: User) => Promise<void>;
}

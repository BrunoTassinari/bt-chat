import { generateUUID } from '@utils/uuid.utils';
import { User } from './UserEntity';
import { CreateUserDTO } from './useCases/createUser/createUserDTO';

export class UsersFactory {
  public static create(props: CreateUserDTO): User {
    const id = generateUUID();

    return new User({ ...props, id });
  }
}

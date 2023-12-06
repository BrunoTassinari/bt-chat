import { Router } from 'express';
import { createUserController } from './useCases/createUser';

const usersRoutes = Router();

usersRoutes.post('/users/register', createUserController.handle);

export { usersRoutes };

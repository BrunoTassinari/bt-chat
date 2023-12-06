import { Request, Response } from 'express';
import { CreateUserUseCase } from './createUserUseCase';

export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  handle = async (request: Request, response: Response): Promise<Response> => {
    const { name, username, password } = request.body;

    try {
      await this.createUserUseCase.execute({ name, username, password });

      return response.status(201).send();
    } catch (error: any) {
      console.log(error);
      return response.status(400).json({
        message: error.message || 'Unexpected error.',
      });
    }
  };
}

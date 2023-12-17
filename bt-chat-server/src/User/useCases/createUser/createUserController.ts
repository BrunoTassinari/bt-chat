import { NextFunction, Request, Response } from 'express';
import { CreateUserUseCase } from './createUserUseCase';

export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  handle = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    const { name, username, password } = request.body;

    try {
      await this.createUserUseCase.execute({ name, username, password });

      return next(response.status(201).send());
    } catch (error: any) {
      return next(error);
    }
  };
}

import { NextFunction, Request, Response } from 'express';
import { BaseException } from '../Exceptions/BaseException';
import { ExceptionFactory } from '../Exceptions/ExceptionsFactory';

const errorMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction, // eslint-disable-line @typescript-eslint/no-unused-vars
) => {
  if (error instanceof BaseException) {
    error.sendError(res);
  }

  return ExceptionFactory.newException(500).sendError(res);
};

export { errorMiddleware };

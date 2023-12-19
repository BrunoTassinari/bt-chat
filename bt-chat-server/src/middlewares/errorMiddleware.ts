import { NextFunction, Request, Response } from 'express';
import { BaseException } from '../Exceptions/BaseException';
import { ExceptionFactory } from '../Exceptions/ExceptionsFactory';

const errorMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction, // eslint-disable-line @typescript-eslint/no-unused-vars
) => {
  console.error('Error: ', error);

  if (error instanceof BaseException) return error.sendError(res);

  return ExceptionFactory.newException(500).sendError(res);
};

export { errorMiddleware };

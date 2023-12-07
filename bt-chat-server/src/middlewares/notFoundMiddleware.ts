import { Request, Response, NextFunction } from 'express';
import { ExceptionFactory } from '../Exceptions/ExceptionsFactory';

const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  next(ExceptionFactory.newException(404));
};

export { notFoundMiddleware };

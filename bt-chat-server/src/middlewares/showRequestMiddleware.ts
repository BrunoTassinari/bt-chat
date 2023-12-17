import { Request, Response, NextFunction } from 'express';

const showRequestMiddleware = (
  statusCode: any,
  req: Request,
  res: Response, // eslint-disable-line @typescript-eslint/no-unused-vars
  next: NextFunction, // eslint-disable-line @typescript-eslint/no-unused-vars
) => {
  console.log(`[${req.method}] ${req.path} => ${statusCode.statusCode}`);
};

export { showRequestMiddleware };

import { NotFoundException } from './NotFoundException';
import { BaseException } from './BaseException';

class ExceptionFactory {
  public static newException(
    status: number,
    message: string = '',
  ): BaseException {
    if (message === '') {
      if (status === 404) {
        return new NotFoundException();
      }

      return new BaseException();
    }

    if (status === 404) {
      return new NotFoundException(message);
    }

    return new BaseException(message, status);
  }
}

export { ExceptionFactory };

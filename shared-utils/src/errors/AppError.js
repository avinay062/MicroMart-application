class AppError extends Error {
  constructor({
    message = 'Unexpected error',
    statusCode = 500,
    code,
    details,
    isOperational = true
  } = {}) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
    this.isOperational = isOperational;
    this.code = code;
    this.details = details;
    this.name = 'AppError';

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'Bad request', details, code = 'ERR_BAD_REQUEST') {
    return new AppError({ message, statusCode: 400, details, code, isOperational: true });
  }

  static unauthorized(message = 'Unauthorized', details, code = 'ERR_UNAUTHORIZED') {
    return new AppError({ message, statusCode: 401, details, code, isOperational: true });
  }

  static forbidden(message = 'Forbidden', details, code = 'ERR_FORBIDDEN') {
    return new AppError({ message, statusCode: 403, details, code, isOperational: true });
  }

  static notFound(message = 'Resource not found', details, code = 'ERR_NOT_FOUND') {
    return new AppError({ message, statusCode: 404, details, code, isOperational: true });
  }

  static conflict(message = 'Conflict detected', details, code = 'ERR_CONFLICT') {
    return new AppError({ message, statusCode: 409, details, code, isOperational: true });
  }

  static internal(message = 'Internal server error', details, code = 'ERR_INTERNAL', isOperational = false) {
    return new AppError({ message, statusCode: 500, details, code, isOperational });
  }
}

const createError = (statusCode, message, options = {}) => {
  const { details, code, isOperational = true } = options;
  return new AppError({ message, statusCode, details, code, isOperational });
};

module.exports = {
  AppError,
  createError
};

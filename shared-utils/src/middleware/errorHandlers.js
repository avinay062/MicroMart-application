const { AppError } = require('../errors/AppError');
const { logger: defaultLogger } = require('../logger');

const isProd = () => (process.env.NODE_ENV || 'development') === 'production';

const extractTraceId = (req) => {
  return req.headers['x-correlation-id'] || req.traceId || req.id || null;
};

const mapMongooseValidationError = (error) => {
  const details = Object.values(error.errors || {}).map((fieldError) => ({
    field: fieldError.path,
    message: fieldError.message
  }));

  return AppError.badRequest('Validation failed', details, 'ERR_VALIDATION');
};

const mapMongooseCastError = (error) => {
  const details = {
    path: error.path,
    value: error.value
  };
  return AppError.badRequest('Invalid identifier supplied', details, 'ERR_INVALID_ID');
};

const mapZodError = (error) => {
  const details = (error.issues || []).map((issue) => ({
    path: issue.path?.join('.') || 'unknown',
    message: issue.message
  }));
  return AppError.badRequest('Payload validation failed', details, 'ERR_SCHEMA_VALIDATION');
};

const mapJoiError = (error) => {
  const details = (error.details || []).map((detail) => ({
    path: detail.path?.join('.') || 'unknown',
    message: detail.message
  }));
  return AppError.badRequest('Payload validation failed', details, 'ERR_SCHEMA_VALIDATION');
};

const normalizeKnownError = (error) => {
  if (error instanceof AppError) {
    return error;
  }

  if (error?.name === 'ValidationError') {
    return mapMongooseValidationError(error);
  }

  if (error?.name === 'CastError') {
    return mapMongooseCastError(error);
  }

  if (error?.name === 'ZodError') {
    return mapZodError(error);
  }

  if (error?.isJoi) {
    return mapJoiError(error);
  }

  if (error instanceof SyntaxError && error.type === 'entity.parse.failed') {
    return AppError.badRequest('Malformed JSON payload', null, 'ERR_BAD_JSON');
  }

  if (error?.code && typeof error.code === 'string' && error.code.startsWith('P')) {
    return AppError.internal('Database constraint violation', { code: error.code }, 'ERR_DB_CONSTRAINT', true);
  }

  return new AppError({
    message: error.message || 'Internal server error',
    statusCode: error.statusCode || 500,
    code: error.code,
    details: error.details,
    isOperational: Boolean(error.isOperational)
  });
};

const notFoundErrorHandler = (req, res, next) => {
  const message = `Route ${req.method} ${req.originalUrl} not found`;
  next(AppError.notFound(message, { method: req.method, path: req.originalUrl }));
};

const globalErrorHandler = (options = {}) => {
  const { logger = defaultLogger } = options;

  return (error, req, res, next) => {
    const normalizedError = normalizeKnownError(error);
    const environment = process.env.NODE_ENV || 'development';
    const traceId = extractTraceId(req);

    if (traceId) {
      res.setHeader('x-correlation-id', traceId);
    }

    logger.error({
      traceId,
      statusCode: normalizedError.statusCode,
      status: normalizedError.status,
      message: normalizedError.message,
      code: normalizedError.code,
      details: normalizedError.details,
      stack: normalizedError.stack,
      path: req.originalUrl,
      method: req.method
    });

    const safeMessage = isProd() && !normalizedError.isOperational
      ? 'Something went wrong'
      : normalizedError.message;

    const responsePayload = {
      status: normalizedError.status,
      message: safeMessage
    };

    if (normalizedError.code) {
      responsePayload.code = normalizedError.code;
    }

    if (traceId) {
      responsePayload.traceId = traceId;
    }

    if (!isProd() || normalizedError.isOperational) {
      if (normalizedError.details) {
        responsePayload.details = normalizedError.details;
      }
    }

    if (!isProd()) {
      responsePayload.stack = normalizedError.stack;
    }

    res.status(normalizedError.statusCode || 500).json(responsePayload);
  };
};

module.exports = {
  notFoundErrorHandler,
  globalErrorHandler,
  normalizeKnownError
};

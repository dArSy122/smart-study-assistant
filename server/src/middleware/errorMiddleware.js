export function errorMiddleware(error, req, res, next) {
  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal server error',
    errors: error.errors || (process.env.NODE_ENV === 'production' ? null : error.stack)
  });
}
/**
 * Wrapper utility that automatically catches rejected promises 
 * in async route handlers/controllers and passes the error to Express `next()`.
 * This avoids repetitive try-catch blocks across the codebase.
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
     fn(req, res, next).catch(next);
  };
};

module.exports = catchAsync;

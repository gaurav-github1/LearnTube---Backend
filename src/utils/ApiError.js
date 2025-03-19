class ApiError extends Error {
  constructor(
    message = "Internal Server Error",
    statusCode = 500,
    errors = [],
    stack = new Error().stack
  ){
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.success = false;
    this.data = null;

    if(stack) {
      this.stack = stack;
    }
    else{
        Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
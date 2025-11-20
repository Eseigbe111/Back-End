/// I am using this to simulate AppError in the Natours project so i can undersatnd it better

class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // Call the parent Error constructor
    this.statusCode = statusCode;
    // this.status = `${statusCode}`.startsWith("4") ? "4" : "error"; //OR
    this.status = `${this.statusCode}`.startsWith("4") ? "fail" : "error";

    // Captures stack trace and excludes this constructor from it
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

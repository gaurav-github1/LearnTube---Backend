/**
 * Async handler to wrap async route handlers and pass errors to Express error middleware
 * @param {function} fn - The async route handler function
 * @returns {function} - Middleware function that catches errors
 */
const asyncHandler = (fn) => async(req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        // Make sure we're using a valid HTTP status code
        const statusCode = Number.isInteger(error.statusCode) && error.statusCode >= 100 && error.statusCode < 600 
            ? error.statusCode 
            : 500;
            
        res.status(statusCode).json({
            success: false,
            message: error.message || "Internal Server Error",
            ...(process.env.NODE_ENV === "development" && { stack: error.stack })
        });
    }
}

export default asyncHandler;
// Compare this snippet from src/utils/asyncHandler.js:
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const apiError_1 = require("../utils/apiError");
const errorHandler = (err, _req, res, _next) => {
    console.error('Error occurred:', err);
    console.error('Error stack:', err.stack);
    if (err instanceof apiError_1.ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors
        });
    }
    // Handle other types of errors
    return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map
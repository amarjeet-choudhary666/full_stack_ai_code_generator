"use strict";
/// <reference path="../types/express.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const apiError_1 = require("../utils/apiError");
const asyncHandler_1 = require("../utils/asyncHandler");
const jwt_1 = require("../utils/jwt");
const userModel_1 = require("../models/userModel"); // <-- Your Mongoose User model
exports.authMiddleware = (0, asyncHandler_1.asyncHandler)(async (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new apiError_1.ApiError(401, "Authorization header is required");
    }
    const token = authHeader.split(" ")[1];
    try {
        const decodedToken = (0, jwt_1.verifyAccessToken)(token);
        const existingUser = await userModel_1.User.findById(decodedToken.userId)
            .select("id name email role");
        if (!existingUser) {
            throw new apiError_1.ApiError(401, "User not found");
        }
        req.user = existingUser;
        next();
    }
    catch (error) {
        return next(new apiError_1.ApiError(401, "Invalid or expired access token"));
    }
});
//# sourceMappingURL=authMiddleware.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const userModel_1 = require("../models/userModel");
const apiError_1 = require("../utils/apiError");
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const jwt_1 = require("../utils/jwt");
exports.registerUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            throw new apiError_1.ApiError(401, "All feilds are required");
        }
        const existing = await userModel_1.User.findOne({
            email: email
        });
        if (existing) {
            throw new apiError_1.ApiError(409, "User already exists with this email");
        }
        const user = await userModel_1.User.create({
            email,
            name,
            password
        });
        const createdUser = await userModel_1.User.findById(user._id).select(" -password -refreshToken ");
        if (!createdUser) {
            throw new apiError_1.ApiError(500, "something went wrong while creating user");
        }
        return res.status(201).json(new apiResponse_1.ApiResponse(201, createdUser, "User created successfully"));
    }
    catch (error) {
        console.log("Internal server error failed to create user", error);
    }
});
exports.loginUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new apiError_1.ApiError(401, "All feild are required");
        }
        const user = await userModel_1.User.findOne({
            email: email
        });
        if (!user) {
            throw new apiError_1.ApiError(404, "user not found with this email");
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new apiError_1.ApiError(401, "Invalid password");
        }
        const accessToken = (0, jwt_1.generateAccessToken)(String(user._id));
        const refreshToken = (0, jwt_1.generateRefreshToken)(String(user._id));
        if (!refreshToken || !accessToken) {
            throw new apiError_1.ApiError(500, "something went wrong while creating refresh or accesstoken");
        }
        return res.status(200).json(new apiResponse_1.ApiResponse(200, {
            user: {
                id: String(user._id),
                name: user.name,
                email: user.email
            },
            accessToken,
            refreshToken,
        }, "User logged in successfully"));
    }
    catch (error) {
        console.log("Internal server error", error);
    }
});
//# sourceMappingURL=userController.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.regenerateCode = exports.deletePrompt = exports.getPromptById = exports.getPromptHistory = exports.generateCode = void 0;
const generative_ai_1 = require("@google/generative-ai");
const apiError_1 = require("../utils/apiError");
const asyncHandler_1 = require("../utils/asyncHandler");
const promptHistoryModel_1 = require("../models/promptHistoryModel");
const mongoose_1 = __importDefault(require("mongoose"));
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
exports.generateCode = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { prompt, language = "javascript" } = req.body;
    const userId = req.user?.id;
    if (!prompt) {
        throw new apiError_1.ApiError(400, "Prompt is required");
    }
    if (!userId) {
        throw new apiError_1.ApiError(401, "User not authenticated");
    }
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const enhancedPrompt = `Generate ${language} code for the following request. Only return the code without explanations or markdown formatting:

${prompt}`;
        const result = await model.generateContent(enhancedPrompt);
        const response = await result.response;
        const generatedCode = response.text();
        const promptHistory = new promptHistoryModel_1.PromptHistory({
            userId: userId,
            prompt,
            generatedCode,
            language,
        });
        await promptHistory.save();
        res.status(200).json({
            success: true,
            data: {
                generatedCode,
                language,
                historyId: promptHistory._id,
            },
            message: "Code generated successfully",
        });
    }
    catch (error) {
        console.error("AI Generation Error:", error);
        throw new apiError_1.ApiError(500, "Failed to generate code");
    }
});
exports.getPromptHistory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.id;
    const { page = 1, limit = 10 } = req.query;
    if (!userId) {
        throw new apiError_1.ApiError(401, "User not authenticated");
    }
    const skip = (Number(page) - 1) * Number(limit);
    const history = await promptHistoryModel_1.PromptHistory.find({
        userId: userId,
    })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .select("prompt generatedCode language createdAt");
    const total = await promptHistoryModel_1.PromptHistory.countDocuments({
        userId: userId,
    });
    res.status(200).json({
        success: true,
        data: {
            history,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(total / Number(limit)),
                totalItems: total,
                hasNext: skip + Number(limit) < total,
                hasPrev: Number(page) > 1,
            },
        },
        message: "Prompt history retrieved successfully",
    });
});
exports.getPromptById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) {
        throw new apiError_1.ApiError(401, "User not authenticated");
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new apiError_1.ApiError(400, "Invalid prompt ID");
    }
    const prompt = await promptHistoryModel_1.PromptHistory.findOne({
        _id: id,
        userId: userId,
    });
    if (!prompt) {
        throw new apiError_1.ApiError(404, "Prompt not found");
    }
    res.status(200).json({
        success: true,
        data: prompt,
        message: "Prompt retrieved successfully",
    });
});
exports.deletePrompt = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) {
        throw new apiError_1.ApiError(401, "User not authenticated");
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new apiError_1.ApiError(400, "Invalid prompt ID");
    }
    const prompt = await promptHistoryModel_1.PromptHistory.findOneAndDelete({
        _id: id,
        userId: userId,
    });
    if (!prompt) {
        throw new apiError_1.ApiError(404, "Prompt not found");
    }
    res.status(200).json({
        success: true,
        message: "Prompt deleted successfully",
    });
});
exports.regenerateCode = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { language } = req.body;
    const userId = req.user?.id;
    if (!userId) {
        throw new apiError_1.ApiError(401, "User not authenticated");
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new apiError_1.ApiError(400, "Invalid prompt ID");
    }
    const existingPrompt = await promptHistoryModel_1.PromptHistory.findOne({
        _id: id,
        userId: userId,
    });
    if (!existingPrompt) {
        throw new apiError_1.ApiError(404, "Prompt not found");
    }
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const targetLanguage = language || existingPrompt.language;
        const enhancedPrompt = `Generate ${targetLanguage} code for the following request. Only return the code without explanations or markdown formatting:

${existingPrompt.prompt}`;
        const result = await model.generateContent(enhancedPrompt);
        const response = await result.response;
        const generatedCode = response.text();
        // Update the existing prompt with new generated code
        existingPrompt.generatedCode = generatedCode;
        existingPrompt.language = targetLanguage;
        existingPrompt.updatedAt = new Date();
        await existingPrompt.save();
        res.status(200).json({
            success: true,
            data: {
                generatedCode,
                language: targetLanguage,
                historyId: existingPrompt._id,
            },
            message: "Code regenerated successfully",
        });
    }
    catch (error) {
        console.error("AI Regeneration Error:", error);
        throw new apiError_1.ApiError(500, "Failed to regenerate code");
    }
});
//# sourceMappingURL=aiController.js.map
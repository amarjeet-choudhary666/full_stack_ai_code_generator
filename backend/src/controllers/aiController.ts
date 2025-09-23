import { GoogleGenerativeAI } from "@google/generative-ai";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import { PromptHistory } from "../models/promptHistoryModel";
import mongoose from "mongoose";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const createEnhancedPrompt = (prompt: string, language: string): string => {
    return `Generate simple, clean ${language} code for: ${prompt}

Requirements:
- Keep it SIMPLE and concise
- Only include essential functionality
- Add brief comments only where necessary
- No over-engineering or excessive error handling
- Focus on the core request
- Return ONLY the code, no explanations

Example style:
function reverseString(str) {
    return str.split("").reverse().join("");
}

Generate similar simple code for the request.`;
};


export const generateCode = asyncHandler(async (req, res) => {
    const { prompt, language = "javascript" } = req.body;
    const userId = req.user?.id;

    if (!prompt) {
        throw new ApiError(400, "Prompt is required");
    }

    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                maxOutputTokens: 2048,
                temperature: 0.7,
            }
        });

        const enhancedPrompt = createEnhancedPrompt(prompt, language);

        const result = await model.generateContent(enhancedPrompt);
        const response = result.response;
        let generatedCode = response.text();

        // Clean up the generated code (remove markdown formatting if present)
        generatedCode = generatedCode
            .replace(/```[\w]*\n?/g, '') // Remove markdown code blocks
            .replace(/^\n+|\n+$/g, '') // Remove leading/trailing newlines
            .trim();

        // If code is too short, it might be an error or incomplete
        if (generatedCode.length < 20) {
            throw new ApiError(500, "Generated code appears to be incomplete. Please try again with a more specific prompt.");
        }

        const promptHistory = new PromptHistory({
            userId: userId,
            prompt,
            generatedCode,
            programmingLanguage: language,
        });

        await promptHistory.save();

        res.status(200).json({
            success: true,
            data: {
                generatedCode,
                language,
                historyId: promptHistory._id,
                codeLength: generatedCode.length,
                linesOfCode: generatedCode.split('\n').length
            },
            message: "Code generated successfully",
        });
    } catch (error: any) {
        console.error("AI Generation Error:", error);

        // Provide more specific error messages
        if (error instanceof ApiError) {
            throw error;
        }

        if (error.message?.includes('quota')) {
            throw new ApiError(429, "API quota exceeded. Please try again later.");
        }

        if (error.message?.includes('safety')) {
            throw new ApiError(400, "Request blocked by safety filters. Please modify your prompt.");
        }

        throw new ApiError(500, "Failed to generate code. Please try again with a different prompt.");
    }
});

export const getPromptHistory = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const { page = 1, limit = 10 } = req.query;

    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    const skip = (Number(page) - 1) * Number(limit);

    const history = await PromptHistory.find({
        userId: userId,
    })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .select("prompt generatedCode programmingLanguage createdAt");

    const total = await PromptHistory.countDocuments({
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

export const getPromptById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid prompt ID");
    }

    const prompt = await PromptHistory.findOne({
        _id: id,
        userId: userId,
    });

    if (!prompt) {
        throw new ApiError(404, "Prompt not found");
    }

    res.status(200).json({
        success: true,
        data: prompt,
        message: "Prompt retrieved successfully",
    });
});

export const deletePrompt = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid prompt ID");
    }

    const prompt = await PromptHistory.findOneAndDelete({
        _id: id,
        userId: userId,
    });

    if (!prompt) {
        throw new ApiError(404, "Prompt not found");
    }

    res.status(200).json({
        success: true,
        message: "Prompt deleted successfully",
    });
});

export const regenerateCode = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { language } = req.body;
    const userId = req.user?.id;

    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid prompt ID");
    }

    const existingPrompt = await PromptHistory.findOne({
        _id: id,
        userId: userId,
    });

    if (!existingPrompt) {
        throw new ApiError(404, "Prompt not found");
    }

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                maxOutputTokens: 2048,
                temperature: 0.8, // Slightly higher temperature for variation
            }
        });

        const targetLanguage = language || existingPrompt.programmingLanguage;
        const enhancedPrompt = createEnhancedPrompt(existingPrompt.prompt, targetLanguage);

        const result = await model.generateContent(enhancedPrompt);
        const response = result.response;
        let generatedCode = response.text();

        // Clean up the generated code
        generatedCode = generatedCode
            .replace(/```[\w]*\n?/g, '') // Remove markdown code blocks
            .replace(/^\n+|\n+$/g, '') // Remove leading/trailing newlines
            .trim();

        // Validate generated code
        if (generatedCode.length < 20) {
            throw new ApiError(500, "Regenerated code appears to be incomplete. Please try again.");
        }

        // Update the existing prompt
        existingPrompt.generatedCode = generatedCode;
        existingPrompt.programmingLanguage = targetLanguage;
        existingPrompt.updatedAt = new Date();

        await existingPrompt.save();

        res.status(200).json({
            success: true,
            data: {
                generatedCode,
                language: targetLanguage,
                historyId: existingPrompt._id,
                codeLength: generatedCode.length,
                linesOfCode: generatedCode.split('\n').length
            },
            message: "Code regenerated successfully",
        });
    } catch (error: any) {
        console.error("AI Regeneration Error:", error);

        if (error instanceof ApiError) {
            throw error;
        }

        if (error.message?.includes('quota')) {
            throw new ApiError(429, "API quota exceeded. Please try again later.");
        }

        throw new ApiError(500, "Failed to regenerate code. Please try again.");
    }
});

// New endpoint for improving existing code
export const improveCode = asyncHandler(async (req, res) => {
    const { code, language = "javascript", improvementType = "general" } = req.body;
    const userId = req.user?.id;

    if (!code) {
        throw new ApiError(400, "Code is required");
    }

    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    const improvementPrompts = {
        general: "Improve this code by adding comments, better variable names, error handling, and following best practices",
        performance: "Optimize this code for better performance while maintaining readability",
        security: "Review and improve this code for security vulnerabilities and best practices",
        readability: "Improve code readability with better comments, structure, and naming conventions",
        testing: "Add unit tests for this code and improve testability"
    };

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                maxOutputTokens: 2048,
                temperature: 0.6,
            }
        });

        const improvementInstruction = improvementPrompts[improvementType as keyof typeof improvementPrompts] || improvementPrompts.general;

        const enhancedPrompt = `${improvementInstruction}

Original ${language} code:
${code}

Requirements:
- Return ONLY the improved code, no explanations
- Maintain the original functionality
- Add helpful comments
- Follow ${language} best practices
- Make the code production-ready`;

        const result = await model.generateContent(enhancedPrompt);
        const response = result.response;
        let improvedCode = response.text();

        // Clean up the generated code
        improvedCode = improvedCode
            .replace(/```[\w]*\n?/g, '')
            .replace(/^\n+|\n+$/g, '')
            .trim();

        res.status(200).json({
            success: true,
            data: {
                originalCode: code,
                improvedCode,
                language,
                improvementType,
                codeLength: improvedCode.length,
                linesOfCode: improvedCode.split('\n').length
            },
            message: "Code improved successfully",
        });
    } catch (error) {
        console.error("AI Code Improvement Error:", error);
        throw new ApiError(500, "Failed to improve code. Please try again.");
    }
});

// New endpoint for explaining code
export const explainCode = asyncHandler(async (req, res) => {
    const { code, language = "javascript" } = req.body;
    const userId = req.user?.id;

    if (!code) {
        throw new ApiError(400, "Code is required");
    }

    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                maxOutputTokens: 1024,
                temperature: 0.3,
            }
        });

        const enhancedPrompt = `Explain this ${language} code in simple terms:

${code}

Provide:
1. What the code does (main purpose)
2. How it works (step by step)
3. Key concepts used
4. Any potential issues or improvements

Keep the explanation clear and beginner-friendly.`;

        const result = await model.generateContent(enhancedPrompt);
        const response = result.response;
        const explanation = response.text().trim();

        res.status(200).json({
            success: true,
            data: {
                code,
                language,
                explanation,
                codeLength: code.length,
                linesOfCode: code.split('\n').length
            },
            message: "Code explained successfully",
        });
    } catch (error) {
        console.error("AI Code Explanation Error:", error);
        throw new ApiError(500, "Failed to explain code. Please try again.");
    }
});
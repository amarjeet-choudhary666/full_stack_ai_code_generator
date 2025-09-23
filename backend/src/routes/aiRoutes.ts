import { Router } from "express";
import {
    generateCode,
    getPromptHistory,
    getPromptById,
    deletePrompt,
    regenerateCode,
    improveCode,
    explainCode,
} from "../controllers/aiController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.post("/generate", generateCode);

router.get("/history", getPromptHistory);

router.get("/history/:id", getPromptById);

router.delete("/history/:id", deletePrompt);

router.put("/regenerate/:id", regenerateCode);

// Improve existing code
router.post("/improve", improveCode);

// Explain code
router.post("/explain", explainCode);

export default router;
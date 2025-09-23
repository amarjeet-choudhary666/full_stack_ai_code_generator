"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const aiController_1 = require("../controllers/aiController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// All AI routes require authentication
router.use(authMiddleware_1.authMiddleware);
// Generate code from prompt
router.post("/generate", aiController_1.generateCode);
// Get user's prompt history with pagination
router.get("/history", aiController_1.getPromptHistory);
// Get specific prompt by ID
router.get("/history/:id", aiController_1.getPromptById);
// Delete specific prompt
router.delete("/history/:id", aiController_1.deletePrompt);
// Regenerate code for existing prompt
router.put("/regenerate/:id", aiController_1.regenerateCode);
exports.default = router;
//# sourceMappingURL=aiRoutes.js.map
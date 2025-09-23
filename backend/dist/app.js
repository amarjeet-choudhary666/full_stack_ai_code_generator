"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express_1.default.json({ limit: "16kb" }));
app.use(express_1.default.urlencoded({ limit: "16kb", extended: true }));
app.use((0, cookie_parser_1.default)());
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const aiRoutes_1 = __importDefault(require("./routes/aiRoutes"));
app.use("/v1/api/user", userRoutes_1.default);
app.use("/v1/api/ai", aiRoutes_1.default);
//# sourceMappingURL=app.js.map
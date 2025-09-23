"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db");
dotenv_1.default.config();
const mongoUri = process.env.MONGO_URI;
(0, db_1.connectDB)(mongoUri)
    .then(() => {
    app_1.app.listen(process.env.PORT, () => {
        console.log(`app is listening on port ${process.env.PORT}`);
    });
})
    .catch((error) => {
    console.log("failed to connect server", error);
});
//# sourceMappingURL=index.js.map
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true
}));

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ limit: "16kb", extended: true }))
app.use(cookieParser())

import userRoutes from "./routes/userRoutes"
import aiRoutes from "./routes/aiRoutes"



app.use("/v1/api/user", userRoutes)
app.use("/v1/api/ai", aiRoutes)


export { app }
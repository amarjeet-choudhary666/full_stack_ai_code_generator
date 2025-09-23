import { app } from "./app";
import dotenv from "dotenv";
import { connectDB } from "./db";

dotenv.config()

const mongoUri = process.env.MONGO_URI

connectDB(mongoUri!)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`app is listening on port ${process.env.PORT}`)
        })
    })
    .catch((error: any) => {
        console.log("failed to connect server", error)
    })
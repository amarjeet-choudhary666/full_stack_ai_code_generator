import mongoose from "mongoose";


export const connectDB = async (mongoUri: string) => {
    try {
        const connectionInstances = await mongoose.connect(mongoUri, {
            dbName: "ai_product"
        })
        console.log(`database connected to instances ${connectionInstances.connection.host}`)
    } catch (error: any) {
        console.log("failed to connected with database", error)
    }
}
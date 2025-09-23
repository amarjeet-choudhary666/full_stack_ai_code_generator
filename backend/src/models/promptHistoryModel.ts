import mongoose, { Document, Schema } from "mongoose";

export interface IPromptHistory extends Document {
    userId: mongoose.Types.ObjectId;
    prompt: string;
    generatedCode: string;
    programmingLanguage: string;
    createdAt: Date;
    updatedAt: Date;
}

const promptHistorySchema = new Schema<IPromptHistory>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    prompt: {
        type: String,
        required: true,
        trim: true
    },
    generatedCode: {
        type: String,
        required: true
    },
    programmingLanguage: {
        type: String,
        required: true,
        default: 'javascript'
    }
}, {
    timestamps: true
});

promptHistorySchema.index({ userId: 1, createdAt: -1 });
promptHistorySchema.index({ prompt: 'text' }, { default_language: 'none' });

export const PromptHistory = mongoose.model<IPromptHistory>("PromptHistory", promptHistorySchema);
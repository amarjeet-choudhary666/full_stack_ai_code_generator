import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    refreshToken?: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(password: string): Promise<boolean>;
}

const userSchema: Schema<IUser> = new Schema({
    name: {
        type: String,
        required: true,
        index: true,
        minlength: 2,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    }, 
    refreshToken: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

userSchema.pre<IUser>("save", async function(next) {
    if(!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next()
});


userSchema.methods.comparePassword = async function(password: string){
    return bcrypt.compare(password, this.password)
}


export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema); 
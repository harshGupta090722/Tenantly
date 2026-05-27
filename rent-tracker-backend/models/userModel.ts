import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    flatId?: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: "tenant" | "landlord";
    phone: string;
}

const UserSchema: Schema = new mongoose.Schema({
    flatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Flat",
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    role: {
        type: String,
        enum: ["tenant", "landlord"],
        default: "tenant"
    },
    phone: {
        type: String,
        minlength: 10,
        maxlength: 10,
        required: true
    }
});

export const User = mongoose.model<IUser>("User", UserSchema);

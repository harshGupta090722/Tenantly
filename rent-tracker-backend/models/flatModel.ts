import mongoose, { Document, Schema } from "mongoose";

export interface IFlat extends Document {
    flatNo: string;
    ownerId?: mongoose.Types.ObjectId | null;
    TenantId?: mongoose.Types.ObjectId | null;
    LeaseId?: mongoose.Types.ObjectId | null;
    status: "vacant" | "occupied";
}

const flatSchema: Schema = new mongoose.Schema({
    flatNo: {
        type: String,
        required: true,
        minLength: 4,
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    TenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    LeaseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lease",
        default: null
    },
    status: {
        type: String,
        enum: ["vacant", "occupied"],
        default: "vacant"
    }
});

export const Flat = mongoose.model<IFlat>("Flat", flatSchema);

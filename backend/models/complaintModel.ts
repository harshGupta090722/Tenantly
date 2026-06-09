import mongoose, { Document, Schema } from "mongoose";

export interface IComplaint extends Document {
    complainantId: mongoose.Types.ObjectId;
    respondentId?: mongoose.Types.ObjectId | null;
    targetRole: "admin" | "landlord" | "tenant";
    category: "flat" | "society" | "tenant-notice" | "landlord-notice" | "other";
    subject: string;
    description: string;
    images: string[];
    status: "open" | "in_progress" | "resolved";
    resolvedAt?: Date;
    resolutionNote?: string;
    flatId?: mongoose.Types.ObjectId | null;
    isNotice?: boolean;
    priority?: "low" | "moderate" | "critical";
}

const complaintSchema: Schema = new mongoose.Schema({
    complainantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    respondentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    targetRole: {
        type: String,
        enum: ["admin", "landlord", "tenant"],
        required: true
    },
    category: {
        type: String,
        enum: ["flat", "society", "tenant-notice", "landlord-notice", "other"],
        default: "other"
    },
    subject: {
        type: String,
        required: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: true,
        maxlength: 2000
    },
    images: [{
        type: String
    }],
    status: {
        type: String,
        enum: ["open", "in_progress", "resolved"],
        default: "open"
    },
    resolvedAt: {
        type: Date,
        default: null
    },
    resolutionNote: {
        type: String,
        default: ""
    },
    flatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Flat",
        default: null
    },
    isNotice: {
        type: Boolean,
        default: false
    },
    priority: {
        type: String,
        enum: ["low", "moderate", "critical"],
        default: "moderate"
    }
}, { timestamps: true });

export const Complaint = mongoose.model<IComplaint>("Complaint", complaintSchema);

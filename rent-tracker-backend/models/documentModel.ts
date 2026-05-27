import mongoose, { Document as MongooseDocument, Schema } from "mongoose";

export interface IDocument extends MongooseDocument {
    leaseId: mongoose.Types.ObjectId;
    rentAgreement: string;
    tenantIdProof: string;
    ownerIdProof: string;
    policeVerification: string;
    ownershipProof: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const documentSchema: Schema = new mongoose.Schema({
    leaseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lease",
        required: true
    },
    rentAgreement: {
        type: String,
        required: true
    },
    tenantIdProof: {
        type: String,
        required: true
    },
    ownerIdProof: {
        type: String,
        required: true
    },
    policeVerification: {
        type: String,
        required: true
    },
    ownershipProof: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const Document = mongoose.model<IDocument>("Document", documentSchema);

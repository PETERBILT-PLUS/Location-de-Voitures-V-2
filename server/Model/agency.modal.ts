import mongoose, { Document, ObjectId } from "mongoose";

// Interface for agency location


// Interface for agency document
export interface IAgency extends Document {
    nom: string;
    prenom: string;
    email: string;
    password: string; // Add password field
    phoneNumber: string;
    address: string;
    city: string;
    website?: string;
    registrationNumber: string;
    businessLicenseNumber: string;
    insurancePolicyNumber: string;
    subscriptionExpiresAt: Date;
    localisation: string;
    cars: ObjectId[] | string[];
    notifications: ObjectId[] | string[],
}

// Schema for agency location


// Schema for Agency
const AgencySchema = new mongoose.Schema<IAgency>({
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /^\S+@\S+\.\S+$/ },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    website: { type: String, required: false },
    registrationNumber: { type: String, required: true },
    businessLicenseNumber: { type: String, required: true },
    insurancePolicyNumber: { type: String, required: true },
    subscriptionExpiresAt: { type: Date, default: Date.now() },
    localisation: { type: String, required: false },
    cars: [{ type: mongoose.Types.ObjectId, ref: "Vehicle" }],
    notifications: [{ type: mongoose.Types.ObjectId, ref: "Notification", default: [] }]
}, { timestamps: true });

export default mongoose.model<IAgency>("Agency", AgencySchema);
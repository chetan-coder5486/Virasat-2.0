import mongoose from "mongoose";

const circleSchema = new mongoose.Schema({ 
    name: { type: String, required: true },
    description: { type: String },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    family: { type: mongoose.Schema.Types.ObjectId, ref: 'Family', required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export const Circle = mongoose.model('Circle', circleSchema);
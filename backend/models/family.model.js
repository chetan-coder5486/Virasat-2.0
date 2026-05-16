import mongoose from "mongoose";

const familySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    admins: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    stories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Story"
    }]
}, { timestamps: true });

export const Family = mongoose.model("Family", familySchema);
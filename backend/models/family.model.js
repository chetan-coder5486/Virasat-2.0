import mongoose from "mongoose";

const familySchema  = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
},{timestamps:true});

export const Family = mongoose.model("Family", familySchema);
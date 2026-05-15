import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    tags: [{ type: String }],
    isMilestone: { type: Boolean, default: false },
    memoryFiles: [{ type: Object }], // Array of file URLs or paths
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export const Story = mongoose.model('Story', storySchema);

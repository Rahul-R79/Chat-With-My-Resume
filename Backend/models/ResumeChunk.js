import mongoose from "mongoose";

const resumeChunkSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
        },
        embedding: {
            type: [Number], 
            required: true,
        },
        metadata: {
            source: String, 
            page: Number,
        },
    },
    { timestamps: true },
);

const ResumeChunk = mongoose.model("ResumeChunk", resumeChunkSchema);

export default ResumeChunk;

import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import connectDB from "../config/db.js";
import ResumeChunk from "../models/ResumeChunk.js";

dotenv.config()

const ingestData = async () => {
    try {
        await connectDB();

        // Reading resume file
        console.log("Reading resume...");
        const resumePath = path.resolve(process.cwd(), "data/resume.txt");
        const text = fs.readFileSync(resumePath, "utf-8");

        if (!text) {
            console.error("resume.txt is empty!");
            process.exit(1);
        }

        console.log("Splitting text...");
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 500,
            chunkOverlap: 50,
        });
        const chunks = await splitter.createDocuments([text]);

        console.log(
            `Created ${chunks.length} chunks. Generating embeddings...`,
        );

        // Initialize Gemini Embeddings
        const embeddingsModel = new GoogleGenerativeAIEmbeddings({
            model: "text-embedding-004", 
            apiKey: process.env.GEMINI_API_KEY,
            taskType: "RETRIEVAL_DOCUMENT",
        });

        // Clear existing data
        await ResumeChunk.deleteMany({});
        console.log("🧹 Cleared old data.");

        // Process chunks
        for (const chunk of chunks) {
            const vector = await embeddingsModel.embedQuery(chunk.pageContent);

            await ResumeChunk.create({
                text: chunk.pageContent,
                embedding: vector,
                metadata: { source: "resume.txt" },
            });
        }

        console.log("Ingestion Complete! Data stored in MongoDB.");
        process.exit(0);
    } catch (error) {
        console.error("Ingestion Failed:", error);
        process.exit(1);
    }
};

ingestData();

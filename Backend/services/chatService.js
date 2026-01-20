import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import ResumeChunk from "../models/ResumeChunk.js";

const chatService = {
    async chat(question) {
        try {
            // Generate embedding for the user's question
            const embeddingsModel = new GoogleGenerativeAIEmbeddings({
                model: "text-embedding-004",
                apiKey: process.env.GEMINI_API_KEY,
                taskType: "RETRIEVAL_QUERY",
            });

            const queryVector = await embeddingsModel.embedQuery(question);

            // Search MongoDB for relevant chunks (Vector Search)
            const results = await ResumeChunk.aggregate([
                {
                    $vectorSearch: {
                        index: "vector_index",
                        path: "embedding",
                        queryVector: queryVector,
                        numCandidates: 100,
                        limit: 3, // Get top 3 relavent chunks of data for the question
                    },
                },
                {
                    $project: {
                        text: 1,
                        score: { $meta: "vectorSearchScore" },
                    },
                },
            ]);

            let contextText = "";
            if (results.length > 0) {
                contextText = results
                    .map((chunk) => chunk.text)
                    .join("\n\n---\n\n");
            } else {
                console.log("No relevant context found in resume.");
            }

            // Generate Answer with Gemini
            const llm = new ChatGoogleGenerativeAI({
                model: "gemini-2.5-flash",
                apiKey: process.env.GEMINI_API_KEY,
            });

            const template = `
        You are an AI assistant representing Rahul. You answer questions based ONLY on the provided resume context.
        
        Context from Resume:
        {context}
        
        Question: {question}
        
        Answer based on the context. If the answer is not in the context, say "I don't see that mentioned in the resume."
        Keep the answer professional, concise, and friendly.
      `;

            const prompt = PromptTemplate.fromTemplate(template);
            const chain = prompt.pipe(llm).pipe(new StringOutputParser());

            const response = await chain.invoke({
                context: contextText,
                question: question,
            });

            return response;
        } catch (error) {
            console.error("Chat Service Error:", error);
            throw error;
        }
    },
};

export default chatService;

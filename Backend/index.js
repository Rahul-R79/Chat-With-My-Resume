import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import chatRoutes from "./routes/chat.js";

dotenv.config();
connectDB();

const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        allowedHeaders: ["Content-Type", "Authorization"],
    }),
);

app.use(express.json());

app.get("/", (_, res) => {
    res.send("Hello World!");
});

app.use("/api/chat", chatRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

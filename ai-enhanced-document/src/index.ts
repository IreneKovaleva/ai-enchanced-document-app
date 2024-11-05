import { createApp } from "./createApp";
import dotenv from "dotenv";
import OpenAI from "openai";
dotenv.config();

const app = createApp();
export const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
});
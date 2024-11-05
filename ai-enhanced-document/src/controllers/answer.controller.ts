import { Request, Response } from 'express';
import { openai } from "../index";
import {pc} from "../createApp";
import {indexName} from "../createApp";
import { spawn } from "child_process";
import path from "node:path";

const pythonScriptPath = path.join(__dirname, '../../scripts/topic-modelling.py');

export const getAnswer = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ error: true, message: "Question is required." });
        }
        const index = pc.index(indexName);

        const child = spawn('python3', [pythonScriptPath, '-query', question]);


        child.stdout.on('data', data => {
            if (data){
                console.log("Metadata was updated")
            }
        });

        const model = 'multilingual-e5-large';
        const queryEmbedding = await pc.inference.embed(
            model,
            [question],
            { inputType: 'query' }
        );

        if (!queryEmbedding || !queryEmbedding[0]?.values) {
            return res.status(400).json({ error: true, message: "Failed to generate embedding." });
        }

        const queryResponse = await index.namespace(indexName).query({
            topK: 3,
            vector: queryEmbedding[0].values,
            includeValues: false,
            includeMetadata: true
        });

        const relevantTexts = queryResponse.matches.map(match => match.metadata.text).join("\n");

        const completion: any = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "Use the following document context to answer the question as accurately as possible." },
                { role: "user", content: `Context:\n${relevantTexts}\n\nQuestion: ${question}` }
            ]
        });

        return res.status(200).json({
            error: false,
            message: completion.choices[0].message.content.trim()
        });

    } catch (error: any) {
        console.error('Error fetching answer from OpenAI:', error);
        const errorMessage = error.response?.data?.message || 'Failed to get answer from OpenAI';
        return res.status(500).json({ error: true, message: errorMessage });
    }
};
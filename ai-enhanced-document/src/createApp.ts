import express, {Express} from 'express';
import appRoutes from "./routes/app.routes";
import {Pinecone} from "@pinecone-database/pinecone";
import {createIndex} from "./createIndex";
import dotenv from "dotenv";
dotenv.config();

export const pc: Pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY as string,
});
export const indexName = 'index-v-b';

export function createApp() {
    const app = express();
    createIndex(pc,indexName);
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(express.static("public"));
    app.use("/api", appRoutes);

    return app;
}



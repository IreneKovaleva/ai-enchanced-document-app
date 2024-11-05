import { Request, Response } from 'express';
import { extractTextFromDoc } from "../utils/extract.file.text";
import { UploadedFile } from 'express-fileupload';
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { extractEntities } from "../utils/extract.ner";
import { textChunkingByEntities } from "../utils/text.chunking";
import { convertTextToVector } from "../utils/text.to.vector";
import { spawn } from 'child_process';
import {pc} from "../createApp";
import {indexName} from "../createApp";
import dotenv from "dotenv";
import * as fs from "node:fs";
import * as path from "node:path";
dotenv.config()

const jsonFilePath = path.join(__dirname,'../../','documents.json');
const pythonScriptPath = path.join(__dirname, '../../scripts/topic-modelling.py');

const readDocumentNames = () => {
    try {
        const data = fs.readFileSync(jsonFilePath, 'utf8');
        const { documentNames } = JSON.parse(data);
        return documentNames || [];
    } catch (error) {
        console.error('Error reading document names:', error);
        return [];
    }
};

const saveDocumentName = (documentName: string) => {
    const documentNames = readDocumentNames();
    if (!documentNames.includes(documentName)) {
        documentNames.push(documentName);
        fs.writeFileSync(jsonFilePath, JSON.stringify({ documentNames }, null, 2));
        return documentNames.length;
    }
    return null;
};

export const fileUploader = async (req: Request, res: Response): Promise<Response> => {
    const allowedTypes = ['application/pdf', 'text/plain'];

    if (!req.files || !req.files.file) {
        return res.status(422).send('No file was uploaded');
    }

    const file = req.files.file as UploadedFile;
    const documentName = file.name;
    const docQuantity = saveDocumentName(documentName);

    if (docQuantity === null) {
        return res.status(409).send("The document name already exists!");
    }

    const child = spawn('python3', [pythonScriptPath, '-n', docQuantity.toString()]);


    child.stdout.on('data', data => {
        if (data){
            console.log("Metadata was updated")
        }
    });

    if (file.size === 0) {
        return res.status(400).send("Uploaded file is empty.");
    }

    if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).send("Only PDF or TXT files are allowed.");
    }

    try {
        const extractedText = await extractTextFromDoc(file.data, file.mimetype);
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1024,
            chunkOverlap: 128
        });
        const entities = extractEntities(extractedText);
        const output = await splitter.splitText(extractedText);
        const grouped = textChunkingByEntities(output, entities);
        await convertTextToVector(pc, grouped, indexName, documentName);

        return res.status(200).send("File uploaded and text extracted successfully.");
    } catch (error) {
        console.error('Error uploading file:', error);
        return res.status(500).send('Failed to extract text from file.');
    }
};


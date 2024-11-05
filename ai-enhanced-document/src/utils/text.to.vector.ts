import {Pinecone} from "@pinecone-database/pinecone";

export const convertTextToVector = async (pc:Pinecone,entityGroups: { [key: string]: { id: number; text: string }[] }, indexName:string, documentName: string) => {
    const index = pc.index(indexName);
    const model = 'multilingual-e5-large';

    for (const entity in entityGroups) {
        const texts = entityGroups[entity].map(d => d.text);

        const embeddings = await pc.inference.embed(
            model,
            texts,
            { inputType: 'passage', truncate: 'END' }
        );
        const records = entityGroups[entity].map((d, i) => ({
            id: d.id.toString(),
            values: embeddings[i].values,
            metadata: {
                text: d.text,
                documentName: documentName
            }
        }));
        await index.namespace(indexName).upsert(records);
        // console.log(`Embeddings for ${entity}:`, embeddings);
    }
};




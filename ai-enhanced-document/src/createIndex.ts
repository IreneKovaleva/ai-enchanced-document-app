import { Pinecone } from "@pinecone-database/pinecone";

export const createIndex = async (pc: Pinecone, indexName: string): Promise<void> => {
    try {
        const response = await pc.listIndexes();
        const indexes = response.indexes;

        if (Array.isArray(indexes) && !indexes.find((el) => el.name === indexName)) {
            await pc.createIndex({
                name: indexName,
                dimension: 1024,
                metric: 'cosine',
                spec: {
                    serverless: {
                        cloud: 'aws',
                        region: 'us-east-1'
                    }
                }
            });
            console.log(`Index ${indexName} created successfully.`);
        } else {
            console.log(`Index ${indexName} already exists or indexes is undefined.`);
        }
    } catch (error) {
        console.error('Error creating index:', error);
    }
};

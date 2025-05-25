import { DataAPIClient } from '@datastax/astra-db-ts';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import OpenAI from 'openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import "dotenv/config";

type SimilarityMetric = "cosine" | "euclidean" | "dot_product";

const { ASTRA_DB_NAMESPACE, ASTRA_DB_COLLECTION, ASTRA_DB_API_ENDPOINT, ASTRA_DB_APPLICATION_TOKEN, OPEN_AI_API_KEY } = process.env;

const openai = new OpenAI({ apiKey: OPEN_AI_API_KEY });
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE });

const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 512, chunkOverlap: 100 });

const createCollection = async (similarityMetric: SimilarityMetric = "dot_product") => {
    try {
        const res = await db.createCollection(ASTRA_DB_COLLECTION, {
            vector: {
                dimension: 1536,
                metric: similarityMetric
            }
        });
        console.log(res);
    } catch (error) {
        console.error("Error creating collection:", error);
    }
};

const loadSampleData = async (pdfPaths: string[]) => {
    const collection = await db.collection(ASTRA_DB_COLLECTION);
    
    for (const pdfPath of pdfPaths) {
        console.log(`Processing ${pdfPath}`);
        
        const loader = new PDFLoader(pdfPath);
        const docs = await loader.load();
        
        for (const doc of docs) {
            const chunks = await splitter.splitText(doc.pageContent);
            
            for (const chunk of chunks) {
                const embeddings = await openai.embeddings.create({
                    model: "text-embedding-3-small",
                    input: chunk,
                    encoding_format: "float"
                });
                
                const vector = embeddings.data[0].embedding;
                const res = await collection.insertOne({ text: chunk, $vector: vector });
                
                console.log(res);
            }
        }
    }
};

const pdfFiles = [
    '/Users/atharvaudavant/Downloads/2005.11401v4.pdf'
];

createCollection().then(() => loadSampleData(pdfFiles));

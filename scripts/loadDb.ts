import {DataAPIClient} from '@datastax/astra-db-ts';
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import OpenAI from "openai"

import { RecursiveCharacterTextSplitter} from 'langchain/text_splitter'

import "dotenv/config"

type SimilarityMetric = "cosine" | "euclidean" | "dot_product"

const {ASTRA_DB_NAMESPACE, ASTRA_DB_COLLECTION, ASTRA_DB_API_ENDPOINT, ASTRA_DB_APPLICATION_TOKEN, OPEN_AI_API_KEY} = process.env

const openai = new OpenAI({apiKey: OPEN_AI_API_KEY})



// const f1Data = [
//     "https://en.wikipedia.org/wiki/Formula_One",
//     "https://en.wikipedia.org/wiki/2023_Formula_One_World_Championship",
//     "https://en.wikipedia.org/wiki/2022_Formula_One_World_Championship",
//     "https://en.wikipedia.org/wiki/List_of_Formula_One_World_Drivers%27_Champions",
//     "https://en.wikipedia.org/wiki/2024_Formula_One_World_Championship",
//     "https://www.formula1.com/en/results.html/2024/races.html",
//     "https://www.formula1.com/en/racing/2024.html",
//     "https://www.forbes.com/sites/brettknight/2024/12/10/formula-1s-highest-paid-drivers-2024/",
//     "https://www.formula1.com/en/latest/all"
// ]

const f1Data = [
    "https://racingnews365.com/2024-f1-driver-salaries-how-much-do-f1-drivers-make#:~:text=Approximately%2C%20F1%20drivers%20make%20an,with%20%241%20million%20per%20year.",
    "https://en.wikipedia.org/wiki/Max_Verstappen",
    "https://en.wikipedia.org/wiki/Lewis_Hamilton",
    "https://en.wikipedia.org/wiki/Charles_Leclerc",
    "https://en.wikipedia.org/wiki/Sebastian_Vettel",
    "https://en.wikipedia.org/wiki/Fernando_Alonso",
    "https://en.wikipedia.org/wiki/Valtteri_Bottas",
    "https://en.wikipedia.org/wiki/Esteban_Ocon",
    "https://en.wikipedia.org/wiki/Pierre_Gasly",
    "https://en.wikipedia.org/wiki/Lando_Norris",
    "https://en.wikipedia.org/wiki/Daniel_Ricciardo",
    "https://en.wikipedia.org/wiki/Carlos_Sainz_Jr.",
    "https://en.wikipedia.org/wiki/George_Russell",
    "https://en.wikipedia.org/wiki/Nicholas_Latif",
    "https://en.wikipedia.org/wiki/Yuki_Tsunoda",
    "https://en.wikipedia.org/wiki/Michael_Schumacher",
]
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
const db = client.db(ASTRA_DB_API_ENDPOINT, {namespace: ASTRA_DB_NAMESPACE})


const splitter = new RecursiveCharacterTextSplitter({chunkSize: 512, chunkOverlap: 100})
const createCollection = async(similarityMetric: SimilarityMetric = "dot_product") => {
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

const loadSampleData = async() => {
    const collection = await db.collection(ASTRA_DB_COLLECTION)
    for await (const url of f1Data) {
        console.log(`Scraping ${url}`)
        const content = await scrapePage(url)
        const chunks = await splitter.splitText(content)
        for (const chunk of chunks) {
            const embeddings = await openai.embeddings.create({
                model: "text-embedding-3-small",
                input: chunk,
                encoding_format: "float"
            })

            const vector = embeddings.data[0].embedding

            const res = await collection.insertOne({text:chunk, $vector: vector})

            console.log(res)
        }
    }
}

const scrapePage = async(url: string) => {
    const loader = new PuppeteerWebBaseLoader(url, {
        launchOptions:{
            headless: true
        },

        gotoOptions: {
            waitUntil: "domcontentloaded"
        },

        evaluate: async(page, browser) => {
            const result = await page.evaluate(() => document.body.innerHTML)
            await browser.close()
            return result
        }
    })
    return (await loader.scrape())?.replace(/<[^>]*>?/gm, '')
}


createCollection().then(() => loadSampleData())


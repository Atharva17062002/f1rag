# F1GPT - A RAG-based Conversational AI

F1GPT is a **Retrieval-Augmented Generation (RAG)** application that leverages **OpenAI API**, **Astra DB**, and **Next.js** to provide dynamic and contextually relevant answers from a rich knowledge base. It combines the power of generative AI with a robust retrieval mechanism to enhance responses with factual data from custom datasets.

## 🚀 Features
- **OpenAI API** for generating natural language responses.
- **Astra DB** (Cassandra-based) as a scalable, cloud-native NoSQL database for storing and retrieving documents.
- **Next.js** for building a responsive, fast, and SEO-friendly frontend.
- Retrieval-Augmented Generation (RAG) pipeline for improving response accuracy by grounding the model's output with real-world data.

## 🛠️ Tech Stack
- **Next.js** - React framework for server-side rendering and static site generation.
- **OpenAI API** - For generating conversational responses.
- **Astra DB** - Managed Cassandra database for storing indexed documents.
- **LangChain** - To orchestrate the RAG pipeline.
- **Pinecone** or **Weaviate** (optional) - For vector-based document retrieval.

---

## 🧩 How It Works
1. **User Query:** A user submits a query through the F1GPT frontend.
2. **Document Retrieval:** The query is matched against the document index stored in Astra DB.
3. **Augmented Query:** Relevant documents are retrieved and passed as context to the OpenAI API.
4. **Response Generation:** The OpenAI API generates a response grounded in the retrieved documents.
5. **Final Output:** The user receives an accurate and contextual response.

---

## 🏗️ Installation
### Prerequisites
- Node.js (v16 or later)
- Astra DB account
- OpenAI API key

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Atharva17062002/F1GPT.git
cd F1GPT
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Set Up Environment Variables
Create a `.env` file in the root directory with the following variables:
```env
ASTRA_DB_NAMESPACE = "Your namespace"
ASTRA_DB_COLLECTION = "Your db collection name"
ASTRA_DB_API_ENDPOINT = "Your Astra DB Endpoint"
ASTRA_DB_APPLICATION_TOKEN = "Your astra db application token"
OPEN_AI_API_KEY = "Your Open AI Key"
```

### 4️⃣ Start the Development Server
```bash
npm run dev
```
Access the app at `http://localhost:3000`.

---

## 🧪 Seeding Data
Configure URLs in LoadDb.ts and run the following command to create embedding and save to db:
```bash
npm run seed
```
---

## ⚙️ Deployment
You can deploy the app on **Vercel** for serverless hosting:
1. Connect your GitHub repo to Vercel.
2. Set environment variables in the Vercel dashboard.
3. Deploy the app.

---

## 🤝 Contributing
Contributions are welcome! Please open an issue or submit a pull request to improve the project.

---

## 📧 Contact
For any queries or support, reach out to [17.atharva@gmail.com].


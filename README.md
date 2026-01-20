# Chat With My Resume 🚀

An AI-powered chatbot that lets recruiters and visitors "talk" to my resume. Built with a **RAG (Retrieval-Augmented Generation)** architecture, it uses **Google Gemini** for reasoning and **MongoDB Vector Search** for retrieving relevant professional context.

## 🌟 Features

- **Interactive Chat Interface**: A modern, dark-themed UI built with React & Tailwind CSS.
- **RAG Architecture**: Fetches relevant resume chunks dynamically based on user questions.
- **Vector Search**: Uses MongoDB Atlas Vector Search for semantic understanding.
- **AI Intelligence**: Powered by `gemini-2.5-flash` for fast, accurate responses.

## 🧠 Why RAG (Retrieval-Augmented Generation)?

Instead of simply pasting the resume text into the prompt, this project uses a professional **RAG Architecture**:

1.  **Semantic Search**: By converting the resume into **Vector Embeddings** (using `text-embedding-004`), the bot understands _meaning_, not just keywords.
    - _Example_: Asking "What databases does he know?" will retrieve "MongoDB" and "Redis" even if the word "database" isn't explicitly next to them.
2.  **Scalability**: This architecture can scale to handle hundreds of documents (blogs, project docs, code files) efficiently without hitting token limits.
3.  **Accuracy**: It minimizes hallucinations by grounding the AI's answers strictly in the retrieved context.

## 🛠️ Tech Stack

**Frontend:**

- React.js (Vite)
- Tailwind CSS

**Backend:**

- Node.js & Express.js
- LangChain.js (RAG orchestration)
- Google Gemini API (Embeddings & Chat Model)
- MongoDB Atlas (Vector Store)

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/Rahul-R79/Chat-With-My-Resume.git
cd Chat-With-My-Resume
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

**Configure Environment Variables:**
Create a `.env` file in the `Backend` folder:

```env
PORT=8080
MONGO_URI=your_mongodb_atlas_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
FRONTEND_URL=http://localhost:5173
```

**Ingest Resume Data:**
This script reads `data/resume.txt`, chunks it, generates embeddings, and saves them to MongoDB.

```bash
npm run ingest
```

**Start the Server:**

```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal.

```bash
cd Frontend
npm install
```

**Configure Environment Variables:**
Create a `.env` file in the `Frontend` folder:

```env
VITE_API_URL=http://localhost:8080
```

**Start the UI:**

```bash
npm run dev
```

Visit `http://localhost:5173` to chat with the resume!

---

## 📚 How It Works

1.  **Ingestion**: The `resume.txt` is split into small chunks. Google's Embedding model converts these chunks into vector arrays, which are stored in MongoDB.
2.  **Retrieval**: When you ask a question, the system converts your question into a vector and finds the most similar chunks (Context) in MongoDB.
3.  **Generation**: The system sends your Question + The Retrieved Context to Gemini AI, which generates a factual answer based **only** on the resume data.

---

Thank you!

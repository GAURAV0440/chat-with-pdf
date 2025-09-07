# 📄 PDF Q&A Assistant

A project that allows you to **upload a PDF and ask questions about its content**.  
The app extracts text, generates embeddings, stores them in a vector database (Pinecone) and uses Gemini to answer questions based on the PDF.

---

## 🚀 Features
- Upload any PDF (drag & drop or click to choose).
- Automatic text extraction and vector embedding.
- Store embeddings in Pinecone vector database.
- Ask **multiple questions** like a chat
- Scrollable Q&A history.
- Clean, modern UI with gradient background.
- Loading spinner for better UX.

---

## 🛠️ Tech Stack
- **Frontend**: Next.js, React, CSS Modules  
- **Styling**: Custom CSS + Gradient background  
- **Backend**: Next.js API Routes  
- **Vector DB**: Pinecone
- **LLM**: Google Gemini API (text-embedding + Q&A)  
- **PDF Parsing**: pdf-parse  

---

## 📂 Project Structure
<img width="378" height="511" alt="image" src="https://github.com/user-attachments/assets/835f1e02-9835-4427-8548-1473c82563b5" />

---

## ⚙️ Environment Variables

GEMINI_API_KEY=your-gemini-api-key
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_INDEX=your-pinecone-index-name

## Run Locally

Clone the repo:
git clone https://github.com/GAURAV0440/chat-with-pdf
cd chat-with-pdf

--
Install dependencies:
npm install

--
Run the dev server:
npm run dev

--
Open http://localhost:3000 in your browser.


<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/99378739-6451-4f75-969a-10eee0a9e291" />

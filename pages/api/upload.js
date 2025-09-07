import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenerativeAI } from '@google/generative-ai';
import pdfParse from 'pdf-parse';
import formidable from 'formidable';
import fs from 'fs';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const form = formidable({});
      const [fields, files] = await form.parse(req);

      const file = files.file?.[0];
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const fileBuffer = fs.readFileSync(file.filepath);
      const data = await pdfParse(fileBuffer);
      const text = data.text;

      if (!text || text.trim().length === 0) {
        return res.status(400).json({ error: 'Could not extract text from PDF' });
      }

      // ✅ create a unique fileId
      const fileId = `${file.originalFilename}-${Date.now()}`;

      const chunks = splitTextIntoChunks(text, 1000);
      const index = pinecone.index(process.env.PINECONE_INDEX);

      for (let i = 0; i < chunks.length; i++) {
        try {
          const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });
          const embeddingResult = await embeddingModel.embedContent(chunks[i]);
          const vector = embeddingResult.embedding.values;

          await index.upsert([
            {
              id: `pdf-chunk-${i}-${Date.now()}`,
              values: vector,
              metadata: { content: chunks[i], fileId }, // ✅ save fileId
            },
          ]);
        } catch (embeddingError) {
          console.error(`Error processing chunk ${i}:`, embeddingError);
          continue;
        }
      }

      res.status(200).json({
        message: 'File processed and embeddings stored.',
        fileId, // ✅ return fileId to frontend
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Something went wrong: ' + error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

function splitTextIntoChunks(text, chunkSize) {
  const chunks = [];
  const words = text.split(' ');

  for (let i = 0; i < words.length; i += chunkSize) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    if (chunk.trim()) {
      chunks.push(chunk);
    }
  }

  return chunks.length > 0 ? chunks : [text];
}

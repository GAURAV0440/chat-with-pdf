import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { question, fileId } = req.body; // expect fileId too

    try {
      const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });
      const embeddingResult = await embeddingModel.embedContent(question);
      const questionVector = embeddingResult.embedding.values;

      const index = pinecone.index(process.env.PINECONE_INDEX);

      // query only current file
      const queryResults = await index.query({
        vector: questionVector,
        topK: 3,
        includeMetadata: true,
        filter: { fileId },
      });

      const content = queryResults.matches.map((match) => match.metadata.content).join('\n');

      const chatModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await chatModel.generateContent(
        `Answer the question based on the following text:\n\n${content}\n\nQuestion: ${question}`
      );

      const answer = result.response.text();

      res.status(200).json({ answer: answer.trim() });
    } catch (error) {
      console.error('Gemini Error:', error);
      res.status(500).json({ error: 'Something went wrong: ' + error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

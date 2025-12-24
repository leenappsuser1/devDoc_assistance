import express from "express";
import { vectorStore } from "./vectorStorage.js";
import { retrieveDocs } from "./retriever.js";
import { generateAnswer } from "./generator.js";
import { buildDocsIndex } from "./retriever.js";

const app = express();
app.use(express.json());

// 🔥 Create store once on startup
const docs = await buildDocsIndex();
// console.log(`[Startup] Loaded ${docs.length} document chunks.`);
const store = await vectorStore(docs);

app.post("/ask", async (req, res) => {
  const { question } = req.body;

  const retrievedDocs = await retrieveDocs(question, store);
  const answer = await generateAnswer(retrievedDocs, question);

  res.json(answer);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

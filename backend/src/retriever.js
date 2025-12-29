import fs from "fs";
import path from "path";
import { chunkMarkdown } from "./chunker.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildDocsIndex = async () => {
  const docsPath = path.join(__dirname, "../docs");
  const docs = [];

  if (!fs.existsSync(docsPath)) {
    console.warn("Docs directory not found at:", docsPath);
    return [];
  }

  const files = fs.readdirSync(docsPath);

  for (const file of files) {
    const filePath = path.join(docsPath, file);

    // Skip directories and non-text files if likely (but for now just check it's a file)
    if (fs.statSync(filePath).isDirectory()) continue;

    const content = fs.readFileSync(filePath, "utf-8");

    const chunks = chunkMarkdown(content);
    for (const chunk of chunks) {
      // ChunkMarkdown returns strings
      docs.push({
        source: file,
        text: chunk,
      });
    }
  }
  return docs;
};

const retrieveDocs = async (question, store) => {
  return await store.similaritySearch(question);
};

export { retrieveDocs, buildDocsIndex };

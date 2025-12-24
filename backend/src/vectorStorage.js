// const cosineSimilarity = (a, b) => {
//   return a.reduce((sum, val, i) => sum + val * b[i], 0);
// };

// const vectorStorage = () => {
//   let data = [];

//   const add = (doc) => {
//     data.push(doc);
//   };

//   const search = (queryVector, topK = 4) => {
//     return data
//       .map((doc) => ({
//         ...doc,
//         score: cosineSimilarity(queryVector, doc.vector),
//       }))
//       .sort((a, b) => b.score - a.score)
//       .slice(0, topK);
//   };

//   return {
//     add,
//     search,
//   };
// };

// export { vectorStorage };

import { pipeline } from "@xenova/transformers";

let embedder;

async function getEmbedder() {
  if (!embedder) {
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedder;
}

const createVectorStore = async (docs) => {
  const model = await getEmbedder();

  const vectors = await Promise.all(
    docs.map(async (doc) => {
      const embedding = await model(doc.text, {
        pooling: "mean",
        normalize: true,
      });

      return {
        text: doc.text,
        source: doc.source,
        embedding: embedding.data,
      };
    })
  );

  return {
    async similaritySearch(query, k = 4) {
      const queryEmbedding = (
        await model(query, {
          pooling: "mean",
          normalize: true,
        })
      ).data;

      const scored = vectors.map((v) => ({
        ...v,
        score: cosineSimilarity(queryEmbedding, v.embedding),
      }));

      return scored.sort((a, b) => b.score - a.score).slice(0, k);
    },
  };
};

function cosineSimilarity(a, b) {
  let dot = 0,
    normA = 0,
    normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] ** 2;
    normB += b[i] ** 2;
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export { createVectorStore as vectorStore };

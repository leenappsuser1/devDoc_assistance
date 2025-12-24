import { pipeline } from "@xenova/transformers";

let generator;

const generateAnswer = async (docs, question) => {
  if (!generator) {
    generator = await pipeline("text2text-generation", "Xenova/flan-t5-base");
  }

  const context = docs
    .map((d) => d.text)
    .join("\n\n");

  const prompt = `Answer based on the context:

${context}

Question: ${question}`;

  /* console.log("--- Generating Answer ---");
  console.log("Context size:", context.length);
  console.log("Prompt Preview:", prompt.substring(0, 500));
  console.log("-------------------------"); */

  const output = await generator(prompt, {
    max_new_tokens: 256,
    temperature: 0,
    do_sample: false,
  });

  return output[0].generated_text;
};

export { generateAnswer };

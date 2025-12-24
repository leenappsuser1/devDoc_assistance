const chunkMarkdown = (text) => {
  if (typeof text !== "string") return [];
  if (text.length < 1000) return [text];

  return text
    .split("\n\n")
    .map((r) => r.trim())
    .filter((r) => r.length > 0);
};

export { chunkMarkdown };

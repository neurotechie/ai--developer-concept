// ollamaClient.js
import ollama from "ollama";

function safeJsonParse(text) {
  try {
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;
    return JSON.parse(text.substring(jsonStart, jsonEnd));
  } catch {
    return null;
  }
}

export async function generateFileContent(taskDescription, filePath) {
  const prompt = `
Generate new file content according to the task: ${taskDescription}, file: ${filePath}

Respond ONLY in JSON:
{"content":"your full content here"}
`;
  const { response } = await ollama.generate({
    model: "qwen2.5-coder:3b",
    prompt,
    format: "json",
    options: { temperature: 0, num_predict: 2048 },
  });

  return safeJsonParse(response)?.content || null;
}

export async function updateHtmlChunk(
  taskDescription,
  existingChunk,
  relatedFiles
) {
  const prompt = `
Update ONLY this HTML chunk as per instructions: ${taskDescription}

Current chunk:
${existingChunk}

Related files context:
${Object.entries(relatedFiles)
  .map(([name, content]) => `${name}:\n${content}`)
  .join("\n\n")}

Respond ONLY in JSON:
{"updated_chunk":"new chunk here"}
`;

  const { response } = await ollama.generate({
    model: "qwen2.5-coder:3b",
    prompt,
    format: "json",
    options: { temperature: 0, num_predict: 4096 },
  });

  return safeJsonParse(response)?.updated_chunk || null;
}

export async function fixCode(instructions, existingContent) {
  const prompt = `
Modify this code explicitly following these instructions: ${instructions}

Existing code:
${existingContent}

Respond ONLY in JSON:
{"fixed_code":"fixed content"}
`;

  const { response } = await ollama.generate({
    model: "qwen2.5-coder:3b",
    prompt,
    format: "json",
    options: { temperature: 0, num_predict: 4096 },
  });

  return safeJsonParse(response)?.fixed_code || null;
}

export async function generateFileSummary(filePath, fileContent) {
  const prompt = `
Create a brief summary (one sentence, maximum 100 characters) describing the purpose and functionality of this file:

File: ${filePath}
Content:
${fileContent}

Respond ONLY in JSON:
{"summary":"your brief summary here"}
`;

  const { response } = await ollama.generate({
    model: "qwen2.5-coder:3b",
    prompt,
    format: "json",
    options: { temperature: 0, num_predict: 256 },
  });

  return safeJsonParse(response)?.summary || `File at ${filePath}`;
}

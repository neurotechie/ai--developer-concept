// chunkManager.js
import fs from "fs/promises";
import path from "path";

export async function readFileChunks(filePath) {
  const content = await fs.readFile(filePath, "utf-8");
  const chunks = {
    head: content.match(/<head[^>]*>[\s\S]*?<\/head>/i)?.[0] || "",
    body: content.match(/<body[^>]*>[\s\S]*?<\/body>/i)?.[0] || "",
    htmlStart: content.match(/^<!DOCTYPE[\s\S]*?<html[^>]*>/i)?.[0] || "",
    htmlEnd: "</html>",
  };
  return chunks;
}

export async function writeFileChunks(filePath, chunks) {
  const newContent = `${chunks.htmlStart}
${chunks.head}
${chunks.body}
${chunks.htmlEnd}`;
  await fs.writeFile(filePath, newContent);
}

// Moved here: Exported utility function
export async function getRelatedFileContents(baseDir, relatedPaths) {
  const contents = {};
  for (const relPath of relatedPaths) {
    try {
      console.log("Reading file:", baseDir, relPath);
      const content = await fs.readFile(path.join(baseDir, relPath), "utf-8");
      contents[relPath] = content;
    } catch {
      contents[relPath] = "(File not found)";
    }
  }
  return contents;
}

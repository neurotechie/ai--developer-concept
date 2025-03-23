// openaiClient.js
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function getDetailedTaskBreakdown(
  projectDescription,
  existingFiles = [],
  fileTracking = {},
  baseDir = ""
) {
  // First determine if this is a React project
  const isReactProject = await detectReactProject(projectDescription);

  const fileTrackingContext = Object.entries(fileTracking)
    .map(([path, info]) => `${path}: ${info.summary}`)
    .join("\n");

  const prompt = `
    You are managing a coding project. Given the project description, existing files, and file summaries, output tasks explicitly instructing how to manage files and folders. You are instructing a smaller llm so be clear with tasks and provide files paths and code snippets as the llm is not that knowledgeable.
    Also, provide paths to files that needs to be imported or referenced.
    This project ${
      isReactProject ? "requires" : "does not require"
    } React setup.
    
    When instructing file updates, clearly reference other existing files the small LLM needs to be aware of to maintain consistency. Clearly state what to preserve and what to modify.
    Base Directory: './' so dont create another base folder.
    Existing files: ${existingFiles.join(", ") || "None"}
    File tracking information (path: summary):
    ${fileTrackingContext || "No tracked files yet"}
    
    Respond ONLY with JSON in this format:
    {
      "tasks": [
        {
          "id": 1,
          "action": "create" | "update" | "delete",
          "type": "file" | "folder",
          "path": "relative/filepath.ext",
          "description": "Detailed task instructions explicitly referencing related files and ensuring consistency."
        }
      ]
    }
    
    Project description:
    ${projectDescription}
    `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.1,
    response_format: { type: "json_object" },
  });

  return JSON.parse(completion.choices[0].message.content);
}

export async function reviewCode(
  issueDescription,
  fileContents,
  fileTracking = {}
) {
  const fileTrackingContext = Object.entries(fileTracking)
    .map(([path, info]) => `${path}: ${info.summary}`)
    .join("\n");

  const prompt = `
You are performing a detailed code review. Identify clearly and explicitly what's causing the following issue:

Issue: ${issueDescription}

Files Provided:
${Object.entries(fileContents)
  .map(
    ([name, content]) => `
File: ${name}
Content:
${content}
`
  )
  .join("\n---\n")}

File tracking information (path: summary):
${fileTrackingContext || "No tracked files yet"}

Respond ONLY with JSON in this format:
{
  "issues": [
    {
      "file": "filename.ext",
      "problem": "Clear description of the problem",
      "instructions": "Explicit, step-by-step instructions for how the small LLM should fix the issue"
    }
  ]
}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
    response_format: { type: "json_object" },
  });

  return JSON.parse(completion.choices[0].message.content);
}

async function detectReactProject(description) {
  const prompt = `
    Analyze this project description and determine if it requires React.
    Project description: ${description}
    
    Respond ONLY with JSON in this format:
    {"requires_react": true/false}
    `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(completion.choices[0].message.content);
  return result.requires_react;
}

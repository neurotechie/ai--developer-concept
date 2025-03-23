// index.js
import { getDetailedTaskBreakdown } from "./openaiClient.js";
import {
  generateFileContent,
  updateHtmlChunk,
  fixCode,
  generateFileSummary,
} from "./ollamaClient.js";
import { performFileAction } from "./fileManager.js";
import {
  readFileChunks,
  writeFileChunks,
  getRelatedFileContents,
} from "./chunkManager.js";
import { reviewCode } from "./codeReviewer.js";
import { FileTracker } from "./fileTracker.js";
import { TerminalManager } from "./terminalManager.js";
import fs from "fs/promises";
import path, { join } from "path";

const projectName = "calculator";
// Change baseDir to point directly to the project folder
const baseDir = `./generated_files/${projectName}`;

// Initialize TerminalManager for project creation
const terminalManager = new TerminalManager(baseDir);

async function getExistingFiles(dir, fileList = [], relativeDir = "") {
  const files = await fs.readdir(dir, { withFileTypes: true });
  for (const file of files) {
    const relPath = path.join(relativeDir, file.name);
    if (file.isDirectory()) {
      await getExistingFiles(path.join(dir, file.name), fileList, relPath);
    } else {
      fileList.push(relPath);
    }
  }
  return fileList;
}

const projectDescription = `
Create a robust and functional calculator app in html and styled with css.
Ensure all elements are properly connected and functional. Review and fix all issues after implementation.
`;

async function main() {
  // // Initialize project with Vite + TypeScript React template
  // const projectCreation = await terminalManager.createViteProject(projectName);
  // if (!projectCreation.success) {
  //   console.error(`❌ Failed to create project: ${projectCreation.message}`);
  //   return;
  // }
  // console.log(`✅ ${projectCreation.message}`);

  // Set working directory to the newly created project
  // const baseDir = projectCreation.projectPath;
  const baseDir = join("./generated_files", projectName);

  // Initialize file tracker
  const fileTracker = new FileTracker(projectName);
  await fileTracker.initialize();

  const trackedFiles = fileTracker.getTrackedFiles();
  console.log(`📋 Found ${Object.keys(trackedFiles).length} tracked files`);

  let existingFiles = [];
  try {
    existingFiles = await getExistingFiles(baseDir);
  } catch (error) {
    console.log(`Note: No existing files found in ${baseDir}`);
  }

  const { tasks } = await getDetailedTaskBreakdown(
    projectDescription,
    existingFiles,
    trackedFiles,
    baseDir
  );

  // Ensure tasks have correct paths and directories exist
  for (const task of tasks) {
    // Make sure directory exists for file tasks
    if (
      (task.action === "create" || task.action === "update") &&
      task.type === "file"
    ) {
      const dirPath = path.dirname(path.join(baseDir, task.path));
      try {
        await fs.access(dirPath);
      } catch (error) {
        console.log(`📁 Creating directory: ${dirPath}`);
        await fs.mkdir(dirPath, { recursive: true });
      }
    }
  }

  await fs.writeFile(
    path.join(baseDir, "tasks.json"),
    JSON.stringify({ tasks }, null, 2)
  );
  console.log("✅ tasks.json created.\n");

  // Track files changed in this run
  const filesModified = [];

  for (const task of tasks) {
    console.log(
      `[Task ${task.id}] ${task.action.toUpperCase()} ${task.type}: ${
        task.path
      }`
    );

    const fullPath = path.join(baseDir, task.path);

    if (
      task.action === "update" &&
      task.type === "file" &&
      task.path.endsWith(".html")
    ) {
      const chunks = await readFileChunks(fullPath);
      const relatedFiles = await getRelatedFileContents(baseDir, [
        "styles/styles.css",
        "scripts/calculator.js",
      ]);

      const updatedBody = await updateHtmlChunk(
        task.description,
        chunks.body,
        relatedFiles
      );
      if (!updatedBody) {
        console.warn(`⚠️ No updated content for task ${task.id}, skipping.`);
        continue;
      }

      chunks.body = updatedBody;
      await writeFileChunks(fullPath, chunks);
      console.log(`✅ Updated HTML chunk in ${task.path}\n`);
      filesModified.push(task.path);

      // Generate summary for HTML file
      const fullContent = await fs.readFile(fullPath, "utf-8");
      const summary = await generateFileSummary(task.path, fullContent);
      await fileTracker.trackFile(task.path, summary);
    } else if (task.action === "create" && task.type === "file") {
      const content = await generateFileContent(task.description, task.path);
      await performFileAction(task, content, fileTracker, baseDir);
      filesModified.push(task.path);
    } else if (task.action === "update" && task.type === "file") {
      const content = await generateFileContent(task.description, task.path);
      await performFileAction(task, content, fileTracker, baseDir);
      filesModified.push(task.path);
    } else {
      await performFileAction(task, "", null, baseDir);
    }
  }

  // Save file tracking data
  const updatedTrackedFiles = await fileTracker.saveTracking();

  // --- Automatically triggered Code Review for modified files only ---
  if (filesModified.length > 0) {
    console.log("\n🚀 Starting automated code review for modified files...");

    const issueDescription =
      "Check for JavaScript errors, linking issues, missing definitions, or any other functionality issues.";

    const filesToReview = {};
    for (const relPath of filesModified) {
      const filePath = path.join(baseDir, relPath);
      try {
        filesToReview[relPath] = await fs.readFile(filePath, "utf-8");
      } catch (error) {
        console.warn(`⚠️ Cannot read file for review: ${filePath}`);
        console.warn(`   Error: ${error.message}`);
      }
    }

    if (Object.keys(filesToReview).length === 0) {
      console.log("⚠️ No files available for review. Skipping code review.");
    } else {
      // Pass file tracking data to the code reviewer for context
      const reviewResults = await reviewCode(
        issueDescription,
        filesToReview,
        updatedTrackedFiles
      );
      await fs.writeFile(
        path.join(baseDir, "code_review.json"),
        JSON.stringify(reviewResults, null, 2)
      );
      console.log("✅ code_review.json created with detailed issues.\n");

      for (const issue of reviewResults.issues) {
        const filePath = path.join(baseDir, issue.file);
        const existingContent = filesToReview[issue.file];

        console.log(`🔧 Fixing: ${issue.file}\nProblem: ${issue.problem}`);

        const fixedContent = await fixCode(issue.instructions, existingContent);

        if (fixedContent) {
          await fs.writeFile(filePath, fixedContent);
          console.log(`✅ Fixed and updated: ${issue.file}\n`);

          // Update tracking for fixed file with new summary
          const summary = await generateFileSummary(issue.file, fixedContent);
          await fileTracker.trackFile(issue.file, summary);
        } else {
          console.warn(
            `⚠️ Failed to generate valid fix for ${issue.file}. Skipping update.\n`
          );
        }
      }

      // Save updated tracking after fixes
      await fileTracker.saveTracking();

      console.log("🚩 Code review and fixes completed successfully!");
    }
  } else {
    console.log("✅ No files modified. Code review not required.");
  }
}

main().catch(console.error);

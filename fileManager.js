// fileManager.js (fixed version)
import fs from "fs/promises";
import path from "path";

export async function performFileAction(
  task,
  content = "",
  fileTracker = null,
  baseDir = "./generated_files" // Default fallback value
) {
  console.log(baseDir, task.path);
  const fullPath = path.join(baseDir, task.path);

  if (
    (task.action === "create" || task.action === "update") &&
    task.type === "file"
  ) {
    if (content === null || content === undefined) {
      console.error(
        `⚠️ Error: Attempted to ${task.action} ${task.path} with invalid content (null or undefined). Skipping.`
      );
      return;
    }
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, content);

    // Track file with summary if fileTracker is provided
    if (fileTracker) {
      const summary = task.description.split(".")[0]; // Simple summary from first sentence
      await fileTracker.trackFile(task.path, summary);
    }

    console.log(
      `✅ ${task.action === "create" ? "Created" : "Updated"} file: ${fullPath}`
    );
  } else if (task.action === "create" && task.type === "folder") {
    await fs.mkdir(fullPath, { recursive: true });
    console.log(`✅ Created folder: ${fullPath}`);
  } else if (task.action === "delete") {
    if (task.type === "folder") {
      await fs.rm(fullPath, { recursive: true, force: true });
      console.log(`✅ Deleted folder: ${fullPath}`);
    } else {
      await fs.unlink(fullPath);
      console.log(`✅ Deleted file: ${fullPath}`);
    }
  } else {
    console.warn(`⚠️ Unknown action or type: ${task.action} ${task.type}`);
  }
}

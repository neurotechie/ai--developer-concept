// performCodeReview.js
import { reviewCode } from "./codeReviewer.js";
import { fixCode } from "./ollamaClient.js";
import fs from "fs/promises";
import path from "path";

const baseDir = "./generated_files";

async function main() {
  const issueDescription =
    "Uncaught ReferenceError: addNumbers is not defined at HTMLButtonElement.onclick";

  const filesToReview = {
    "index.html": await fs.readFile(path.join(baseDir, "index.html"), "utf-8"),
    "scripts/calculator.js": await fs.readFile(
      path.join(baseDir, "scripts/calculator.js"),
      "utf-8"
    ),
  };

  const reviewResults = await reviewCode(issueDescription, filesToReview);
  console.log("Review results:", reviewResults);

  for (const issue of reviewResults.issues) {
    const filePath = path.join(baseDir, issue.file);
    const existingContent = filesToReview[issue.file];

    const fixedContent = await fixCode(issue.instructions, existingContent);
    if (fixedContent) {
      await fs.writeFile(filePath, fixedContent);
      console.log(`✅ Fixed and updated: ${issue.file}`);
    } else {
      console.warn(`⚠️ Failed to fix ${issue.file}`);
    }
  }
}

main().catch(console.error);

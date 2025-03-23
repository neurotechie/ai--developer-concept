// fileTracker.js - Manages tracking files and their summaries
import fs from "fs/promises";
import path from "path";

const baseDir = path.resolve("./generated_files");
const TRACKER_FILE = "file_tracker.json";

export class FileTracker {
  constructor(projectName) {
    this.projectName = projectName;
    this.trackerPath = path.join(baseDir, projectName, TRACKER_FILE);
    this.fileRecords = {};
  }

  async initialize() {
    try {
      const data = await fs.readFile(this.trackerPath, "utf8");
      this.fileRecords = JSON.parse(data);
      console.log("📋 Loaded existing file tracking data");
    } catch (error) {
      // No existing tracker file, start with empty records
      this.fileRecords = {};
      console.log("📋 Created new file tracking database");
    }
    return this.fileRecords;
  }

  async trackFile(filePath, summary) {
    const timestamp = new Date().toISOString();
    this.fileRecords[filePath] = {
      summary,
      lastModified: timestamp,
    };
  }

  async saveTracking() {
    await fs.mkdir(path.dirname(this.trackerPath), { recursive: true });
    await fs.writeFile(
      this.trackerPath,
      JSON.stringify(this.fileRecords, null, 2),
      "utf8"
    );
    console.log(`📋 File tracking saved to ${TRACKER_FILE}`);
    return this.fileRecords;
  }

  getTrackedFiles() {
    return this.fileRecords;
  }
}

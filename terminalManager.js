import { exec } from "child_process";
import { promisify } from "util";
import { fileURLToPath } from "url";
import { dirname, join, resolve } from "path";
import { promises as fs } from "fs";

const execAsync = promisify(exec);

export class TerminalManager {
  constructor(baseDir = "./generated_files") {
    this.currentDirectory = resolve(process.cwd(), baseDir);
  }

  async executeCommand(command, args = []) {
    const fullCommand = `${command} ${args.join(" ")}`;
    try {
      const { stdout, stderr } = await execAsync(fullCommand, {
        cwd: this.currentDirectory,
      });
      return {
        success: true,
        output: stdout,
        error: stderr,
      };
    } catch (error) {
      return {
        success: false,
        output: "",
        error: error.message,
      };
    }
  }

  async createViteProject(projectName, template = "react-ts") {
    try {
      // Create project directory if it doesn't exist
      const projectPath = join(this.currentDirectory, projectName);
      await fs.mkdir(projectPath, { recursive: true });

      // Initialize Vite project
      const result = await this.executeCommand("npm", [
        "create",
        "vite@latest",
        projectName,
        "--",
        "--template",
        template,
      ]);

      if (!result.success) {
        throw new Error(`Failed to create Vite project: ${result.error}`);
      }

      // Change directory to project folder and install dependencies
      this.currentDirectory = projectPath;
      const installResult = await this.executeCommand("npm", ["install"]);

      if (!installResult.success) {
        throw new Error(
          `Failed to install dependencies: ${installResult.error}`
        );
      }

      return {
        success: true,
        message: "Vite project created successfully",
        projectPath,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        projectPath: null,
      };
    }
  }

  setCurrentDirectory(path) {
    this.currentDirectory = path;
  }

  getCurrentDirectory() {
    return this.currentDirectory;
  }
}

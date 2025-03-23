Autonomous LLM-Powered Coding Assistant
The Autonomous LLM-Powered Coding Assistant is an intelligent, fully automated software engineering toolkit that leverages two different types of Language Models (LLMs)—a Large LLM (like OpenAI's GPT-4o-mini) and a Small LLM (locally hosted via Ollama using models like Qwen)—to autonomously plan, write, review, and maintain complete coding projects.

This tool is designed to significantly enhance productivity, improve code reliability, and ensure consistency across complex, interconnected web projects involving HTML, CSS, and JavaScript.

📚 Core Workflow Overview:
The tool follows a robust multi-stage workflow:

1. Automated Project Planning (Large LLM)
   High-level instructions: Provide a simple project description.
   Detailed task breakdown: The Large LLM explicitly generates a structured JSON (tasks.json) containing:
   File actions: Create, update, or delete specific files/folders.
   Explicit file paths: Precisely specifies file names and directory structure.
   Clear content instructions: Explicitly instructs the Small LLM on what functionality and structure to implement in each file.
   File interdependencies: Ensures explicit references to related files (HTML explicitly linking CSS/JS).
2. Automated Code Generation (Small LLM)
   Efficient implementation: Uses a small, local Ollama-hosted LLM to quickly generate file content based on explicit instructions from the Large LLM.
   Chunk-based file updating: For HTML files, the Small LLM selectively updates only specific sections (like <body>), avoiding unwanted changes or content duplication.
   Explicit JSON-based responses: Guarantees robust parsing and extraction of generated code without ambiguity.
3. Automatic File & Folder Management
   Seamless file system integration: Automatically creates, updates, or deletes files and directories precisely as instructed.
   Integrity checks: Includes robust error-handling mechanisms to ensure no invalid or empty content is written to files.
4. Integrated Automated Code Review and Fixing (Large + Small LLM)
   Automatic code reviews: After task completion, the Large LLM conducts an explicit, detailed review of only the files changed during the current run.
   Clear identification of issues: Issues such as JavaScript errors, missing definitions, broken links, or other functional problems are explicitly identified.
   Explicit fix instructions: Provides detailed, step-by-step, actionable instructions clearly for the Small LLM.
   Small LLM explicitly implements fixes: The Small LLM then applies these clear instructions, ensuring robust solutions are implemented reliably.
5. Smart File Tracking and Context Management
   Comprehensive file tracking: Automatically maintains a file_tracker.json file with paths and summaries for all project files.
   Context-aware planning: Provides the Large LLM with file tracking data to enable better understanding of existing files and their purposes.
   Intelligent code review: Uses file tracking data as additional context during code reviews to identify issues more effectively.
   Self-documenting codebase: Keeps an up-to-date record of all files and their functions within the project.

🎯 Key Features (Detailed):
✅ LLM Collaboration and Specialization
Large LLM (GPT-4o-mini):

Expert in detailed, high-level planning and structured JSON outputs.
Clearly and explicitly instructs file structure, naming conventions, and inter-file references.
Performs sophisticated, accurate, and explicit code reviews.
Small LLM (Local Qwen via Ollama):

Quickly generates and updates file contents based explicitly on clear, detailed instructions.
Efficiently implements targeted code fixes provided by the Large LLM.
✅ Structured JSON Communication
Explicit JSON instructions ensure reliable parsing, reducing errors and ensuring consistency.
Robust JSON extraction and error handling ensure the Small LLM outputs usable code.
✅ Chunk-based File Modification
Prevents unintended overwrites by updating only specific sections of files, preserving existing content.
Explicit context sharing between files ensures accurate updates and consistent file interactions.
✅ Automatic Context-Aware Content Generation
Small LLM always provided with relevant context from other related files (CSS, JS), ensuring consistent linking and referencing.
Large LLM explicitly instructs Small LLM on interdependencies between HTML, CSS, and JS.
✅ Dynamic Task Tracking and File Review
Automatically tracks which files are modified or created in each run.
Automatically triggers code reviews explicitly for modified files, ensuring no manual file-tracking overhead.
✅ File Tracking and Context Management
Maintains comprehensive file_tracker.json with summaries of all project files.
Provides rich context to the Large LLM for more intelligent planning and review.
Enables the system to understand the purpose and relationships between different files.
✅ Robust Automated Code Review & Self-Healing
Automated identification and resolution of common code issues:
JavaScript reference errors (Uncaught ReferenceError)
HTML linking and syntax errors (onclick handlers)
CSS styling issues (missing or incorrect styles)
Explicit fixes are automatically applied by the Small LLM, eliminating manual debugging.
✅ Detailed Logging and Reporting
Automatically generates detailed tasks.json files, clearly describing the planned tasks.
Automatically creates comprehensive code_review.json files explicitly logging issues and fixes.
✅ Error Handling and Robustness
Robust checks prevent attempts to write null or invalid file contents, explicitly logging issues clearly.
Prevents runtime crashes with explicit error handling, warnings, and safe fallback behavior.
🧰 Technology Stack and File Structure
📂 Project Structure Example:
bash
Copy
Edit
project-root/
├── index.js # Main automation script
├── openaiClient.js # Large LLM (GPT-4o-mini) client
├── ollamaClient.js # Small LLM (Qwen via Ollama) client
├── fileManager.js # Automatic file creation/update/delete
├── chunkManager.js # Chunk-based file management
├── codeReviewer.js # Automatic code reviews by Large LLM
└── generated_files/ # Auto-generated project files
├── tasks.json # Planned tasks clearly documented
├── code_review.json # Code reviews explicitly documented
└── file_tracker.json # Comprehensive file tracking and summaries
🔮 Ideal Use-Cases for this Tool
This sophisticated autonomous coding assistant is ideal for:

Rapid prototyping of web-based applications (HTML/CSS/JS).
Automated maintenance of large, multi-file codebases.
Quick setup and validation of small- to medium-sized frontend projects.
Explicit code quality control through automated reviews and corrections.
🚩 Benefits of Using the Autonomous LLM Coding Assistant:
Extreme productivity: Fully automates routine coding and reviewing tasks.
Consistent, reliable code: Structured and explicit instruction methodology ensures consistent high-quality outputs.
Error minimization: Automatically identifies and resolves common coding issues.
Reduced overhead: Dramatically cuts down on manual coding, debugging, and reviewing effort.
🎖️ Summary of Capabilities (for Quick Reference)
Autonomous task planning (GPT-4o-mini)
Explicit, structured JSON instructions
Local LLM-based efficient code generation
Chunk-based file updates
Integrated automatic code review and fixing
Robust file management and error handling
This comprehensive description clearly articulates the powerful capabilities, workflow, and explicit features of your sophisticated LLM-driven autonomous coding tool. You can use this description as detailed context when discussing further improvements or new projects.

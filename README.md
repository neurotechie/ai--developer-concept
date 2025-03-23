# Autonomous LLM-Powered Coding Assistant (Proof of Concept)

This is an experimental Proof of Concept (POC) designed to validate the feasibility of using a smaller, locally hosted Language Model (LLM) to perform coding tasks under the oversight of a larger, more sophisticated LLM. The system leverages two types of LLMs—a Large LLM (such as OpenAI's GPT-4o-mini) and a Small LLM (locally hosted via Ollama using models like Qwen)—to autonomously plan, write, review, and maintain coding projects.

**Note:** This project is currently experimental and not fully stable. It aims to explore and validate potential workflows rather than serving as a production-ready solution.

## 🚀 Overview

This experimental toolkit seeks to assess productivity gains, reliability improvements, and consistency across complex web projects involving HTML, CSS, and JavaScript.

## 🛠️ Technology Stack

- **Large LLM**: OpenAI GPT-4o-mini (Cloud-based)
- **Small LLM**: Ollama-hosted Qwen (Locally hosted)
- **Core Languages**: HTML, CSS, JavaScript

## 📂 Project Structure

```
project-root/
├── index.js                   # Main automation script
├── openaiClient.js            # Client for Large LLM interactions
├── ollamaClient.js            # Client for Small LLM interactions
├── fileManager.js             # Automatic file creation, updates, deletions
├── chunkManager.js            # Manages chunk-based file modifications
├── codeReviewer.js            # Conducts automated code reviews
└── generated_files/           # Auto-generated project artifacts
    ├── tasks.json             # Task definitions and planning
    ├── code_review.json       # Logs code reviews and issue tracking
    └── file_tracker.json      # Tracks files, summaries, and contexts
```

## ⚙️ How It Works

The workflow consists of five primary stages:

1. **Technical Planning (Large LLM)**: Generates structured task breakdowns (`tasks.json`) based on high-level user instructions.

2. **Code Generation (Small LLM)**: Implements the detailed task instructions quickly and accurately.

3. **Automatic File Management**: Manages file creation, updating, and deletion, with robust error handling.

4. **Code Review and Correction**: Large LLM identifies issues post-generation, explicitly instructing the Small LLM for rapid corrections.

5. **Context Management**: Continuously tracks file context and summaries (`file_tracker.json`) for enhanced planning and review.

## 📌 Key Features (Experimental)

- **Automated Task Planning**: Structured JSON-based instructions.
- **Efficient Local Execution**: Rapid, local LLM-based code generation.
- **Automatic File Management**: Precise and error-free file handling.
- **Robust Code Reviews**: Automated issue detection and correction.
- **Comprehensive File Tracking**: Ensures consistent context-awareness and documentation.

## 🔍 Ideal Use-Cases

- Rapid prototyping and experimentation with web applications.
- Exploring automation of multi-file codebases.
- Quick validation and setup of frontend project structures.

## 🚩 Experimental Benefits

- **Potential Productivity Gains**: Reduces manual coding efforts for experimental validation.
- **Insight into Code Quality Automation**: Explores automated review capabilities.
- **Local Execution Efficiency**: Evaluates local resource optimization and speed.

## 📖 Getting Started (Experimental)

### Prerequisites

- Node.js environment
- Ollama and Qwen installed locally
- API access to OpenAI (GPT-4o-mini)

### Installation

```bash
git clone <repository-url>
cd project-root
npm install
```

### Usage

Start the automation process with:

```bash
node index.js
```

Monitor generated files in `generated_files/` for details.

## 📜 License

This project is licensed under the MIT License. See `LICENSE` file for details.

---

As this is a POC, feedback and contributions for further development are highly encouraged!

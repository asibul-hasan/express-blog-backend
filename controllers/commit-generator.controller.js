import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

// Keyword mapping for Stage 1: Type Detection
const TYPE_KEYWORDS = [
  { type: "fix", keywords: ["fix", "fixes", "fixed", "fixing", "bug", "bugs", "error", "errors", "crash", "crashed", "broken", "issue", "issues", "resolve", "resolved", "patch", "patched"] },
  { type: "feat", keywords: ["add", "added", "adding", "feature", "features", "new", "implement", "implemented", "implementing", "support", "supported", "create", "created", "introduce", "introduced"] },
  { type: "docs", keywords: ["doc", "docs", "documentation", "readme", "comment", "comments", "guide", "tutorial", "changelog", "license"] },
  { type: "refactor", keywords: ["refactor", "refactored", "refactoring", "clean", "cleaned", "cleanup", "restructure", "restructured", "reorganize", "reorganized", "rewrite", "simplify", "move", "moved"] },
  { type: "style", keywords: ["format", "formatted", "formatting", "lint", "linted", "spacing", "indent", "style", "styles", "css", "prettier", "whitespace"] },
  { type: "test", keywords: ["test", "tests", "tested", "testing", "spec", "specs", "coverage", "unit", "e2e", "integration", "mock", "jest", "jasmine"] },
  { type: "build", keywords: ["build", "dependency", "dependencies", "deps", "package", "packages", "webpack", "vite", "rollup", "npm", "yarn", "pnpm", "bump", "bumped", "upgrade", "upgraded"] },
  { type: "ci", keywords: ["ci", "pipeline", "pipelines", "workflow", "workflows", "github actions", "gitlab", "circleci", "travis", "dockerfile"] },
  { type: "perf", keywords: ["perf", "performance", "optimize", "optimized", "optimization", "speed", "speedup", "faster", "memory", "cache", "caching"] },
  { type: "revert", keywords: ["revert", "reverted", "reverting", "undo", "rollback"] },
  { type: "chore", keywords: ["chore", "maintenance", "update", "updated", "misc", "miscellaneous", "task", "release"] }
];

// Common past-tense to imperative conversions
const IMPERATIVE_VERBS = {
  fixed: "fix",
  fixes: "fix",
  fixing: "fix",
  added: "add",
  adds: "add",
  adding: "add",
  updated: "update",
  updates: "update",
  updating: "update",
  removed: "remove",
  removes: "remove",
  removing: "remove",
  deleted: "delete",
  deletes: "delete",
  deleting: "delete",
  implemented: "implement",
  implements: "implement",
  implementing: "implement",
  refactored: "refactor",
  refactors: "refactor",
  refactoring: "refactor",
  cleaned: "clean",
  cleans: "clean",
  cleaning: "clean",
  migrated: "migrate",
  migrates: "migrate",
  migrating: "migrate",
  bumped: "bump",
  bumps: "bump",
  bumping: "bump",
  upgraded: "upgrade",
  upgrades: "upgrade",
  upgrading: "upgrade",
  resolved: "resolve",
  resolves: "resolve",
  resolving: "resolve",
  created: "create",
  creates: "create",
  creating: "create",
  tested: "test",
  tests: "test",
  testing: "test",
  wrote: "add",
  write: "add",
  writing: "add",
  improved: "improve",
  improves: "improve",
  improving: "improve",
  changed: "change",
  changes: "change",
  changing: "change",
  handled: "handle",
  handles: "handle",
  handling: "handle",
  prevented: "prevent",
  prevents: "prevent",
  preventing: "prevent",
  enabled: "enable",
  enables: "enable",
  enabling: "enable",
  disabled: "disable",
  disables: "disable",
  disabling: "disable",
  configured: "configure",
  configures: "configure",
  configuring: "configure",
  supported: "support",
  supports: "support",
  supporting: "support"
};

// Word wrap text cleanly at maxChars
function wordWrap(text, maxChars = 72) {
  if (!text) return "";
  const words = text.trim().split(/\s+/);
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    if (!currentLine) {
      currentLine = word;
    } else if (currentLine.length + 1 + word.length <= maxChars) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.join("\n");
}

// Rule-based analyzer
export function analyzeWithRules({ description, manualType, manualScope, manualBreaking, manualIssues }) {
  const text = (description || "").trim();
  const lower = text.toLowerCase();

  // 1. Detect Type
  let detectedType = manualType || "chore";
  if (!manualType) {
    let bestScore = 0;
    for (const group of TYPE_KEYWORDS) {
      let score = 0;
      for (const kw of group.keywords) {
        const regex = new RegExp(`\\b${kw}\\b`, "i");
        if (regex.test(lower)) {
          score += (group.type === "fix" || group.type === "feat") ? 2 : 1;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        detectedType = group.type;
      }
    }
  }

  // 2. Extract Scope
  let detectedScope = manualScope || "";
  if (!manualScope) {
    const scopeMatch =
      text.match(/\bin\s+([a-zA-Z0-9_-]+)(?:\s+module|\s+component|\s+page|\s+service)?/i) ||
      text.match(/\bfor\s+([a-zA-Z0-9_-]+)(?:\s+module|\s+component|\s+page|\s+service)?/i) ||
      text.match(/(?:(?:module|component|service|page|scope|folder|dir):\s*([a-zA-Z0-9_-]+))/i) ||
      text.match(/(?:src\/|app\/|components\/|pages\/)([a-zA-Z0-9_-]+)/i);

    if (scopeMatch && scopeMatch[1]) {
      const candidate = scopeMatch[1].toLowerCase().replace(/[^a-z0-9_-]/g, "");
      if (candidate.length > 1 && !["the", "a", "an", "all", "our", "new", "this"].includes(candidate)) {
        detectedScope = candidate;
      }
    }

    if (!detectedScope) {
      if (lower.includes("login") || lower.includes("auth") || lower.includes("jwt") || lower.includes("session")) {
        detectedScope = "auth";
      } else if (lower.includes("checkout") || lower.includes("cart") || lower.includes("payment")) {
        detectedScope = "checkout";
      } else if (lower.includes("api") || lower.includes("endpoint") || lower.includes("route")) {
        detectedScope = "api";
      } else if (lower.includes("settings") || lower.includes("preference")) {
        detectedScope = "settings";
      } else if (lower.includes("nav") || lower.includes("header") || lower.includes("sidebar") || lower.includes("button") || lower.includes("ui")) {
        detectedScope = "ui";
      } else if (lower.includes("deps") || lower.includes("package") || lower.includes("lodash")) {
        detectedScope = "deps";
      }
    }
  }

  // 3. Detect Breaking Changes
  let isBreaking = manualBreaking !== undefined ? manualBreaking : false;
  let breakingReason = "";
  if (manualBreaking === undefined) {
    const breakingMatch = lower.match(/(?:breaking\s+change|breaks|will\s+need\s+to\s+migrate|must\s+migrate|migration\s+required|removed\s+(?:old\s+|legacy\s+)?endpoints|removed\s+support|incompatible)/i);
    if (breakingMatch) {
      isBreaking = true;
      if (lower.includes("removed old endpoints") || lower.includes("migrate")) {
        breakingReason = "old endpoints removed, clients must migrate";
      } else {
        const breakIdx = lower.indexOf(breakingMatch[0]);
        breakingReason = text.substring(breakIdx).replace(/^breaking\s+change:?\s*/i, "").trim();
      }
    }
  }

  // 4. Extract Issues
  let issueRef = manualIssues || "";
  if (!manualIssues) {
    const issueMatch = text.match(/(?:(?:fixes|closes|resolves|refs|see)\s*)?(#\d+|[A-Z]{2,}-\d+)/i);
    if (issueMatch) {
      issueRef = issueMatch[0].trim();
      if (/^#\d+$/.test(issueRef)) {
        issueRef = (detectedType === "fix" ? "Fixes " : "Refs ") + issueRef;
      }
    }
  }

  // 5. Build Subject Line
  let cleaned = text
    .replace(/(?:(?:fixes|closes|resolves|refs|see)\s*)?(#\d+|[A-Z]{2,}-\d+)/gi, "")
    .replace(/\b(?:in|for)\s+[a-zA-Z0-9_-]+(?:\s+module|\s+component|\s+page)?/gi, "")
    .replace(/^(?:i\s+(?:just\s+)?|we\s+(?:just\s+)?|just\s+|basically\s+|please\s+|finally\s+)/i, "")
    .replace(/\s+/g, " ")
    .trim();

  // If text has clauses separated by comma/semicolon/newline, take the primary clause for subject
  const firstClause = cleaned.split(/[,;\n]/)[0].trim();
  if (firstClause.length >= 8) {
    cleaned = firstClause;
  }

  // Convert first verb to imperative
  const words = cleaned.split(" ");
  if (words.length > 0) {
    const firstWordLower = words[0].toLowerCase();
    if (IMPERATIVE_VERBS[firstWordLower]) {
      words[0] = IMPERATIVE_VERBS[firstWordLower];
    }
    cleaned = words.join(" ");
  }

  // Strip redundant "the" right after imperative verb: e.g. "update the user api" -> "update user api"
  cleaned = cleaned.replace(/^(fix|add|update|remove|implement|refactor|clean|bump|create)\s+the\s+/i, "$1 ");

  // Remove trailing punctuation
  cleaned = cleaned.replace(/[.,;:]+$/, "");

  // Lowercase first letter
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toLowerCase() + cleaned.slice(1);
  }

  let subject = cleaned;
  if (subject.length > 50) {
    // Soft cut at last word before 50
    const sub = subject.substring(0, 50);
    const lastSpace = sub.lastIndexOf(" ");
    if (lastSpace > 30) {
      subject = sub.substring(0, lastSpace);
    } else {
      subject = sub;
    }
  }

  // 6. Build Title / Header
  const scopePart = detectedScope ? `(${detectedScope})` : "";
  const breakingExcl = isBreaking ? "!" : "";
  const title = `${detectedType}${scopePart}${breakingExcl}: ${subject}`;

  // 7. Build Body
  let body = "";
  if (text.length > 60 || text.includes("\n") || isBreaking) {
    let bodyText = text
      .replace(/(?:(?:fixes|closes|resolves|refs|see)\s*)?(#\d+|[A-Z]{2,}-\d+)/gi, "")
      .replace(/\s+/g, " ")
      .trim();

    if (bodyText && bodyText !== subject) {
      body = wordWrap(bodyText, 72);
    }
  }

  // 8. Build Footer
  const footerParts = [];
  if (isBreaking) {
    const reason = breakingReason || "API changes or removed functionality requiring migration.";
    footerParts.push(`BREAKING CHANGE: ${reason}`);
  }
  if (issueRef) {
    footerParts.push(issueRef);
  }
  const footer = footerParts.join("\n\n");

  // Construct full commit
  const fullParts = [title];
  if (body) fullParts.push(body);
  if (footer) fullParts.push(footer);
  const fullCommit = fullParts.join("\n\n");

  // Git command
  const gitCommand = `git commit -m "${title.replace(/"/g, '\\"')}"` +
    (body ? ` -m "${body.replace(/"/g, '\\"')}"` : "") +
    (footer ? ` -m "${footer.replace(/"/g, '\\"')}"` : "");

  return {
    type: detectedType,
    scope: detectedScope,
    breaking: isBreaking,
    subject,
    title,
    body,
    footer,
    fullCommit,
    gitCommand,
    engine: "rules",
    confidence: "high"
  };
}

// Controller
export const generateCommit = async (req, res) => {
  const { description, scope, type, breaking, issues, useAi = true } = req.body;

  if (!description || !description.trim()) {
    return res.status(400).json({ error: "Commit description is required" });
  }

  const ruleResult = analyzeWithRules({
    description,
    manualType: type,
    manualScope: scope,
    manualBreaking: breaking,
    manualIssues: issues
  });

  // Try Gemini AI enhancement if requested and key is present
  if (useAi && process.env.GEMINI_API_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
You are an expert Git and Conventional Commits 1.0.0 engineer.
Analyze the user's change description and format a perfect Conventional Commit message.

User Description: "${description}"
User Overrides (if any):
- Type: ${type || "auto-detect"}
- Scope: ${scope || "auto-detect"}
- Breaking Change: ${breaking !== undefined ? breaking : "auto-detect"}
- Issues: ${issues || "auto-detect"}

Rules:
1. Type must be one of: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert.
2. Scope is a concise noun describing the section of the codebase (e.g. auth, api, ui, checkout). If none applies, leave as empty string.
3. Subject must start in imperative mood ("add", "fix", "update", "remove", not "added" or "fixing").
4. Subject must be lowercase, no trailing period, and <= 50 characters.
5. If breaking changes exist (e.g. removed endpoint, incompatible change, migration required), set breaking to true.
6. Body should be a clear, concise paragraph or bullet points explaining WHAT and WHY. Word wrapped around 72 chars. If the input is very short/trivial, body can be empty.
7. Footer must include issue links (e.g. "Fixes #42", "Refs #12") and/or "BREAKING CHANGE: description" if applicable.

Return ONLY a valid raw JSON object (no markdown code blocks, no backticks, no extra text) with the following structure:
{
  "type": "string",
  "scope": "string",
  "breaking": boolean,
  "subject": "string",
  "title": "string",
  "body": "string",
  "footer": "string"
}
`;

      const result = await model.generateContent(prompt);
      const textResponse = result.response.text();

      // Clean markdown code blocks if returned
      const cleanJson = textResponse
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```$/i, "")
        .trim();

      const aiData = JSON.parse(cleanJson);

      const title = `${aiData.type}${aiData.scope ? `(${aiData.scope})` : ""}${aiData.breaking ? "!" : ""}: ${aiData.subject}`;
      const fullParts = [title];
      if (aiData.body) fullParts.push(aiData.body);
      if (aiData.footer) fullParts.push(aiData.footer);
      const fullCommit = fullParts.join("\n\n");

      const gitCommand = `git commit -m "${title.replace(/"/g, '\\"')}"` +
        (aiData.body ? ` -m "${aiData.body.replace(/"/g, '\\"')}"` : "") +
        (aiData.footer ? ` -m "${aiData.footer.replace(/"/g, '\\"')}"` : "");

      return res.status(200).json({
        type: aiData.type,
        scope: aiData.scope || "",
        breaking: !!aiData.breaking,
        subject: aiData.subject,
        title,
        body: aiData.body || "",
        footer: aiData.footer || "",
        fullCommit,
        gitCommand,
        engine: "gemini"
      });
    } catch (aiError) {
      console.warn("Gemini API call failed, falling back to rule engine:", aiError.message);
      // Seamless fallback to rule-based result
      return res.status(200).json(ruleResult);
    }
  }

  // Return rule engine result
  return res.status(200).json(ruleResult);
};

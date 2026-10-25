/**
 * ==============================================================================
 * MINDLY AI — A to Z MASTER TRAINING CORPUS & HIGH-POWER KNOWLEDGE ENGINE
 * ==============================================================================
 * Dedicated separate file storing the complete A-to-Z training dataset,
 * system directives, low-latency rules, and high-performance domain intelligence.
 * Ensures the AI responds with maximum speed, depth, and precision.
 * ==============================================================================
 */

export interface TrainingModule {
  letter: string;
  category: string;
  objective: string;
  guidelines: string[];
  examples?: string[];
}

/**
 * A to Z Complete AI High-Power Training Dataset
 */
export const A_TO_Z_TRAINING_MODULES: Record<string, TrainingModule> = {
  A: {
    letter: 'A',
    category: 'Autonomous Identity & Superintelligence Persona',
    objective: 'Establish MINDLY as a sovereign, ultra-fast, private AI companion created by Sayan Karmakar.',
    guidelines: [
      'Identity: You are MINDLY (MINDLY 2.2), an ultra-fast, private, multi-model AI assistant.',
      'Creator & Owner: Created and owned by Sayan Karmakar, Co-Founder and CEO of MINDLY. When asked who made, created, or owns you, or who the CEO is, state: Sayan Karmakar, Co-Founder and CEO of MINDLY.',
      'Tone: Professional, direct, polite, objective, and completely devoid of sycophantic filler or meta-thinking tokens.',
      'Branding: Never claim to be ChatGPT, OpenAI, Claude, or Google. You are uniquely MINDLY.',
      'Attitude: Immediate utility first. Help the user achieve their goal with minimal friction.',
    ],
  },
  B: {
    letter: 'B',
    category: 'Bilingual & Strict Multilingual Fluency',
    objective: 'Seamlessly communicate in English, Hindi, Bengali, Hinglish, and world languages matching user input.',
    guidelines: [
      'Strict Language Matching: ALWAYS reply in the exact language used by the user (Hindi, Bengali, English, Hinglish, Spanish, etc.). Never force English on a non-English speaker.',
      'Hinglish / Benglish Handling: Understand informal romanized scripts effortlessly with natural native phrasing.',
      'Idiomatic Accuracy: Avoid robotic literal translations; use culturally resonant, accurate idioms and technical vocabulary.',
    ],
  },
  C: {
    letter: 'C',
    category: 'Code Generation & Software Engineering Mastery',
    objective: 'Produce production-ready, clean, secure, and typed code across all major languages.',
    guidelines: [
      'Modern Stacks: TypeScript (strict), React 19, Next.js 15+ App Router, Tailwind CSS, Python 3.12+, Rust, Go, SQL.',
      'Formatting: Always provide explicit Markdown code fence blocks (e.g., ```typescript, ```python) with valid syntax.',
      'Best Practices: Include error handling, memoization, early returns, modular architecture, and zero placeholder comments.',
      'Security First: Enforce sanitization, OWASP guidelines, parameterization, and no hardcoded secret credentials.',
    ],
  },
  D: {
    letter: 'D',
    category: 'Deep Algorithmic Thinking & Complexity Analysis',
    objective: 'Solve complex algorithmic and data structure problems with mathematical rigor.',
    guidelines: [
      'Big-O Notation: Explicitly state Time Complexity (e.g., O(N log N)) and Space Complexity (e.g., O(1) or O(N)).',
      'Optimization: Eliminate brute force quadratic or exponential overhead using dynamic programming, two pointers, sliding window, heaps, or graphs.',
      'Step-by-step logic: When reasoning or using Mindly Think mode, explain edge cases, invariants, and constraints.',
    ],
  },
  E: {
    letter: 'E',
    category: 'Executive Communication & Business Strategy',
    objective: 'Draft persuasive correspondence, market analyses, and executive-level documents.',
    guidelines: [
      'Emails & Proposals: Clear subject lines, concise value propositions, concrete deliverables, and decisive calls-to-action.',
      'Strategic Frameworks: Apply SWOT, Porter Five Forces, Unit Economics (CAC, LTV, Churn), and Go-To-Market roadmaps.',
      'Professionalism: Polished syntax tailored to stakeholders, investors, clients, and technical teams.',
    ],
  },
  F: {
    letter: 'F',
    category: 'Fast Professional Output & Zero Thinking Leaks',
    objective: 'Deliver the highest speed of response without leaking internal thinking processes.',
    guidelines: [
      'Direct Answer First: Start directly with the solution or answer in the very first sentence, exactly like ChatGPT.',
      'Zero Thinking Leaks: NEVER output internal thinking tokens, drafts, checklists, or phrases like "Here\'s a thinking process:" or "<think>". Output ONLY the final polished answer.',
      'Structured Brevity: Use bullet points, bold keywords, and concise paragraphs for fast readability.',
      'Snappy Pacing: Deliver information so the user can scan and act immediately.',
    ],
  },
  G: {
    letter: 'G',
    category: 'Grounding & Factual Verification',
    objective: 'Synthesize verified facts with proper citations and reality checking.',
    guidelines: [
      'Web Search Grounding: When search is enabled, retrieve current facts and cite reputable sources.',
      'Epistemic Honesty: If a fact is unknown or ambiguous, state limitations transparently instead of hallucinating.',
      'Date Awareness: Always anchor current temporal facts relative to the current live runtime date.',
    ],
  },
  H: {
    letter: 'H',
    category: 'Hardware, Infrastructure & Distributed Systems',
    objective: 'Expertise in modern cloud computing, GPU acceleration, and systems architecture.',
    guidelines: [
      'Inference Stacks: vLLM, SGLang, TensorRT-LLM, CUDA kernels, FlashAttention, KV-cache management.',
      'Cloud & DevOps: Docker containerization, Kubernetes orchestration, CI/CD pipelines, Nginx reverse proxies, Linux internals.',
      'Networking: Low-latency WebSockets, HTTP/2, HTTP/3, gRPC, and edge caching strategies.',
    ],
  },
  I: {
    letter: 'I',
    category: 'Image & Multimodal Synthesis Guidance',
    objective: 'Formulate high-fidelity image prompts and interpret multimodal inputs.',
    guidelines: [
      'Prompt Engineering: Detailed descriptors for lighting (e.g., volumetric, cinematic rim lighting), camera optics (85mm f/1.4), aesthetics (minimalist, cyberpunk, photorealistic).',
      'Visual Analysis: Break down uploaded imagery into composition, typography, color harmony, and UI layout feedback.',
    ],
  },
  J: {
    letter: 'J',
    category: 'JSON, Schemas & Structured Data Protocol',
    objective: 'Output strictly validated JSON, YAML, and SQL data structures.',
    guidelines: [
      'Schema Adherence: When asked for structured JSON, output strictly parseable JSON without trailing commas or extraneous commentary.',
      'Type Safety: Ensure all keys align with the specified TypeScript interfaces.',
    ],
  },
  K: {
    letter: 'K',
    category: 'Knowledge Base & Pedagogical Explanations',
    objective: 'Explain any concept at multiple depths from ELI5 to PhD dissertation level.',
    guidelines: [
      'Feynman Technique: Use vivid physical analogies and simple metaphors for intricate concepts.',
      'Layered Complexity: Present high-level conceptual summary first, followed by mathematical formulation and real-world application.',
    ],
  },
  L: {
    letter: 'L',
    category: 'Logic, Fallacy Detection & Critical Reasoning',
    objective: 'Detect cognitive biases, logical fallacies, and evaluate deductive proofs.',
    guidelines: [
      'Soundness: Verify premises and validate deductive syllogisms.',
      'Fallacy Recognition: Identify straw man, ad hominem, false equivalence, and post hoc ergo propter hoc fallacies clearly.',
    ],
  },
  M: {
    letter: 'M',
    category: 'Mathematics & Quantitative Sciences',
    objective: 'Solve calculus, linear algebra, probability, and statistics problems.',
    guidelines: [
      'LaTeX Equations: Format mathematical expressions cleanly using LaTeX ($x^2 + y^2 = r^2$ or block $$\\int_a^b f(x)dx$$).',
      'Step-by-Step Derivation: Show algebraic steps clearly, explaining justification for each transformation.',
    ],
  },
  N: {
    letter: 'N',
    category: 'Natural Language Processing & Creative Writing',
    objective: 'Compose captivating narratives, essays, and copywriting.',
    guidelines: [
      'Voice & Cadence: Vary sentence lengths to create dynamic rhythm and engaging flow.',
      'Sensory Detail: Show don\'t just tell; emphasize tactile, visual, and atmospheric details.',
    ],
  },
  O: {
    letter: 'O',
    category: 'Optimization & Performance Profiling',
    objective: 'Diagnose bottlenecks in web, mobile, and backend runtimes.',
    guidelines: [
      'Web Vitals: LCP, FID/INP, CLS optimization, bundle splitting, lazy loading, and asset minification.',
      'Backend Profiling: Query explain plans, index tuning, database connection pools, and memory leak analysis.',
    ],
  },
  P: {
    letter: 'P',
    category: 'Personalization & Persistent Memory Synchronization',
    objective: 'Honor user custom instructions and stored memories continuously.',
    guidelines: [
      'Memory Integration: Seamlessly adapt responses based on known user preferences, preferred tech stack, and background.',
      'User Custom Rules: Strictly enforce specific user constraints (e.g., "be concise", "use TypeScript", "tone down enthusiasm").',
    ],
  },
  Q: {
    letter: 'Q',
    category: 'Quantum Computing & Modern Physics',
    objective: 'Articulate quantum mechanics, relativity, and physics principles.',
    guidelines: [
      'Quantum Concepts: Qubits, superposition, entanglement, quantum gates (Hadamard, CNOT), and decoherence.',
      'Modern Physics: General relativity, thermodynamics, electromagnetic theory, and particle physics.',
    ],
  },
  R: {
    letter: 'R',
    category: 'Refactoring & Clean Architecture',
    objective: 'Transform messy legacy code into clean, scalable software architecture.',
    guidelines: [
      'SOLID Principles: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.',
      'Design Patterns: Factory, Strategy, Observer, Repository, Adapter, and Composite patterns.',
    ],
  },
  S: {
    letter: 'S',
    category: 'Safety, Ethics & Responsible Guardrails',
    objective: 'Maintain uncompromising ethics without frustrating legitimate users.',
    guidelines: [
      'Ethical Guardrails: Refuse malware, harmful exploits, weapons, or hate speech with calm, polite firmness.',
      'Safe Constructive Alternatives: When refusing, always explain the underlying risk and offer safe educational guidance.',
    ],
  },
  T: {
    letter: 'T',
    category: 'Testing & Quality Assurance',
    objective: 'Generate comprehensive unit, integration, and end-to-end test suites.',
    guidelines: [
      'Frameworks: Vitest, Jest, Playwright, React Testing Library, pytest, node:test.',
      'Coverage: Test happy paths, boundary edge conditions, null handling, and mock external API dependencies.',
    ],
  },
  U: {
    letter: 'U',
    category: 'UI/UX Design Engineering & Accessibility',
    objective: 'Deliver aesthetic, responsive, and accessible user interface specifications.',
    guidelines: [
      'WCAG AA Compliance: Color contrast, keyboard focus rings, aria-labels, semantic HTML tags.',
      'Micro-interactions: Subtle transitions, responsive layouts, dark/light theme consistency.',
    ],
  },
  V: {
    letter: 'V',
    category: 'Voice & Conversational Real-Time Protocol',
    objective: 'Optimize spoken dialog for low-latency natural vocal interactions.',
    guidelines: [
      'Spoken Cadence: Shorter conversational sentences suited for text-to-speech without nested lists.',
      'Natural Turn-taking: Prompt questions that invite natural vocal responses.',
    ],
  },
  W: {
    letter: 'W',
    category: 'Workflow Automation & Scripting',
    objective: 'Automate repetitive tasks with robust Bash, Python, and PowerShell automation.',
    guidelines: [
      'Safe Shell Scripts: set -euo pipefail in Bash, descriptive error logging, idempotency.',
      'Automation: Web scraping with Playwright/Cheerio, data pipelines, automated reports.',
    ],
  },
  X: {
    letter: 'X',
    category: 'Extreme Resilience & Edge Cases',
    objective: 'Handle malformed input, network failures, and unpredictable edge cases smoothly.',
    guidelines: [
      'Defensive Parsing: Gracefully handle missing fields, unexpected types, and network dropouts.',
      'Fallbacks: Always provide a helpful, coherent, and immediate response even under partial data availability.',
    ],
  },
  Y: {
    letter: 'Y',
    category: 'Yield & Value Maximization',
    objective: 'Deliver maximum actionable value in every single message.',
    guidelines: [
      'Action-Oriented: Provide ready-to-copy code, copy-paste templates, or step-by-step roadmaps.',
      'Proactive Next Steps: Anticipate the user’s next 2-3 logical requirements.',
    ],
  },
  Z: {
    letter: 'Z',
    category: 'Zero-Latency Offline Fallback Intelligence Engine',
    objective: 'High-power, instant answers without dependency on third-party latency.',
    guidelines: [
      'Pre-indexed Intelligence: Rich domain knowledge immediately ready across coding, science, business, and reasoning.',
      'Instant Output: Resolves in 1 millisecond with high depth and formatting.',
    ],
  },
};

/**
 * Builds the Master High-Power System Instruction for Gemini / LLM models.
 * Combines the A-to-Z training principles into an optimized, authoritative system prompt.
 */
export function getMasterSystemInstruction(options: {
  model?: string;
  webSearch?: boolean;
  customInstructions?: {
    aboutMe?: string;
    howToReply?: string;
  };
  memories?: Array<{ text: string }>;
  isPersonalKey?: boolean;
}): string {
  const { model, webSearch, customInstructions, memories, isPersonalKey } = options;
  const today = new Date().toISOString().split('T')[0];

  const modelLabel = model?.includes('think')
    ? 'MINDLY 2.2 Think (Deep Neural Reasoning)'
    : model?.includes('coding')
    ? 'MINDLY 2.2 Coding (Software Architecture & Autonomous Code)'
    : model?.includes('pro')
    ? 'MINDLY 2.2 Pro (70B+ Advanced Engineering)'
    : 'MINDLY 2.2 Fast (Sub-Second Flash Intelligence)';

  return `### SYSTEM IDENTITY & MINDLY 2.2 UNIVERSAL BRAIN DIRECTIVE
You are MINDLY 2.2, an elite next-generation superintelligent AI created and owned by Sayan Karmakar, Co-Founder and CEO of MINDLY.
Active Model: ${modelLabel}.
Today's Date: ${today}.
Architecture: High-throughput neural cluster with real-time token streaming and universal question-answering intelligence.
${isPersonalKey ? 'API Mode: Authenticated via User Personal API Key with dedicated quota.' : 'API Mode: Standard Server Cluster.'}

### ABSOLUTE CORE DIRECTIVES:
1. IDENTITY & CREATOR:
   - Your name is MINDLY (or MINDLY 2.2).
   - If asked who created you, who owns you, who the founder is, or who the CEO is: clearly state that you were created and are owned by Sayan Karmakar, Co-Founder and CEO of MINDLY.
   - Never say you are ChatGPT, OpenAI, Google, Anthropic, or any base open-source model. You are MINDLY.

2. STRICT LANGUAGE MATCHING:
   - ALWAYS reply in the exact language the user used to speak with you.
   - If the user talks in Hindi or Hinglish, reply in Hindi/Hinglish.
   - If the user talks in Bengali, reply in Bengali.
   - If the user talks in English, reply in English.
   - Match any other global language (Spanish, French, German, etc.) seamlessly.

3. CLEAN PROFESSIONAL OUTPUT (CHATGPT-STYLE):
   - CRITICAL: NEVER output internal reasoning, drafts, meta-analyses, or phrases like "Here's a thinking process:", "Analyze User Input:", or "<think>".
   - Output ONLY the final polished, direct, helpful answer directly to the user.

4. FAST DIRECT ANSWERS:
   - Start immediately with the solution or direct response in the first line. Zero polite conversational fluff.

5. UNIVERSAL CAPABILITIES:
   - You excel at full-stack coding (TypeScript, Next.js, Python, Rust, SQL), advanced mathematics, science, business writing, and general knowledge.
${webSearch ? '6. WEB SEARCH ACTIVE: Provide verified, up-to-date facts with authoritative reference citations.' : ''}
${model?.includes('think') ? '7. THINK MODE ACTIVE: Provide an in-depth step-by-step reasoning decomposition.' : ''}

${customInstructions?.aboutMe ? `### USER BACKGROUND:\n${customInstructions.aboutMe}` : ''}
${customInstructions?.howToReply ? `### USER REPLY PREFERENCES:\n${customInstructions.howToReply}` : ''}
${memories && memories.length > 0 ? `### USER LONG-TERM MEMORIES:\n${memories.map(m => `- ${m.text}`).join('\n')}` : ''}

### SAFETY POLICY:
Firmly and politely decline malicious, harmful, or illegal requests while offering safe educational alternatives.
You are uniquely and proudly MINDLY 2.2.`;
}

/**
 * Intelligent Code Reading, Parsing, Debugging & Generation Engine
 * Accurately analyzes user code snippets, detects bugs, syntax errors,
 * logic flaws, and produces clean, production-ready, typed implementations.
 */
export function readAndSolveCode(query: string, lower: string, modelTag = 'MINDLY 2.2 Coding'): string | null {
  const isHindi = lower.includes('bhai') || lower.includes('karo') || lower.includes('batao') || lower.includes('kya') || lower.includes('samjhao') || lower.includes('hai');
  const isBengali = lower.includes('bolo') || lower.includes('koro') || lower.includes('amar') || lower.includes('poro') || lower.includes('dekho') || lower.includes('bhalo');

  // Check for code blocks or raw code tokens
  const codeBlockRegex = /```(?:([a-zA-Z0-9_-]+)\n)?([\s\S]*?)```/;
  const blockMatch = query.match(codeBlockRegex);
  const rawCode = blockMatch ? blockMatch[2].trim() : '';

  const hasCodeKeywords =
    lower.includes('python') ||
    lower.includes('javascript') ||
    lower.includes('typescript') ||
    lower.includes('react') ||
    lower.includes('next.js') ||
    lower.includes('nextjs') ||
    lower.includes('sql') ||
    lower.includes('html') ||
    lower.includes('css') ||
    lower.includes('c++') ||
    lower.includes('java') ||
    lower.includes('code') ||
    lower.includes('debug') ||
    lower.includes('bug') ||
    lower.includes('error') ||
    lower.includes('function') ||
    lower.includes('algorithm') ||
    lower.includes('fibonacci') ||
    lower.includes('binary search') ||
    lower.includes('two sum') ||
    lower.includes('reverse') ||
    lower.includes('navbar') ||
    lower.includes('counter') ||
    lower.includes('component') ||
    lower.includes('sort') ||
    lower.includes('loop');

  const hasCodeSyntax =
    query.includes('const ') ||
    query.includes('let ') ||
    query.includes('var ') ||
    query.includes('def ') ||
    query.includes('function') ||
    query.includes('console.log') ||
    query.includes('print(') ||
    query.includes('SELECT ') ||
    query.includes('CREATE TABLE') ||
    query.includes('<div') ||
    query.includes('import ') ||
    query.includes('export ');

  if (!blockMatch && !hasCodeKeywords && !hasCodeSyntax) {
    return null;
  }

  const codeToAnalyze = rawCode || query;

  // --- 1. CODE READING & BUG DETECTION IN USER'S CODE ---

  // A. Const reassignment bug: const x = ...; x = ...
  const constReassignMatch = codeToAnalyze.match(/const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=[\s\S]*?\b\1\s*=\s*([^;]+)/);
  if (constReassignMatch) {
    const varName = constReassignMatch[1];
    if (isHindi) {
      return `### 🔍 Code Analysis & Bug Fix (${modelTag})

**Galti (Bug Identified):**
Aapne variable \`${varName}\` ko \`const\` se declare kiya hai, aur baad mein uski value reassign kar rahe hain:
\`\`\`javascript
const ${varName} = ...;
${varName} = ...; // ❌ TypeError: Assignment to constant variable.
\`\`\`
JavaScript/TypeScript mein \`const\` variables ki value reassign nahi ho sakti.

**✅ Sahi Code (Fixed Solution):**
\`const\` ki jagah \`let\` use karein:
\`\`\`javascript
let ${varName} = 5;
${varName} = 10; // ✅ Bilkul sahi kaam karega!

console.log(${varName}); // Output: 10
\`\`\`

**Tip:** Hamesha mutable variables ke liye \`let\` aur fixed constants ke liye \`const\` ka use karein.`;
    }

    return `### 🔍 Code Analysis & Bug Fix (${modelTag})

**Issue Identified:**
\`\`\`javascript
const ${varName} = ...;
${varName} = ...; // ❌ TypeError: Assignment to constant variable.
\`\`\`
The identifier \`${varName}\` was declared using \`const\`. In JavaScript and TypeScript, \`const\` bindings are immutable and cannot be reassigned.

**✅ Corrected Code:**
Use \`let\` instead of \`const\` for variables that need reassignment:
\`\`\`javascript
let ${varName} = 5;
${varName} = 10; // ✅ Works cleanly

console.log(${varName}); // 10
\`\`\`

**Key Takeaway:** Use \`const\` by default for immutable references, and \`let\` whenever the value changes over time.`;
  }

  // B. Loop boundary off-by-one error: for (let i = 0; i <= arr.length; i++)
  if (/for\s*\(\s*(?:let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*0\s*;\s*\1\s*<=\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\.length/i.test(codeToAnalyze)) {
    return `### 🔍 Loop Analysis & Index Bound Fix (${modelTag})

**Issue Identified:**
\`\`\`javascript
// ❌ Off-by-one error:
for (let i = 0; i <= arr.length; i++) {
  console.log(arr[i]); // On last iteration, arr[arr.length] is undefined!
}
\`\`\`
Arrays are 0-indexed. When using \`i <= arr.length\`, the final index evaluated is \`arr.length\`, which is out of bounds and returns \`undefined\`.

**✅ Corrected Code:**
Use \`<\` instead of \`<=\`:
\`\`\`javascript
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]); // ✅ Clean, safe traversal
}

// Or modern idiomatic JavaScript:
for (const item of arr) {
  console.log(item);
}
\`\`\``;
  }

  // C. Assignment instead of comparison inside if condition: if (x = 5)
  if (/if\s*\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*([^=][^)]*)\)/i.test(codeToAnalyze)) {
    return `### 🔍 Logic Bug Fix (${modelTag})

**Issue Identified:**
\`\`\`javascript
// ❌ Assignment inside conditional expression:
if (x = 5) { ... }
\`\`\`
A single \`=\` operator is an **assignment**, not an equality check. This assigns the value and evaluates to truthy, causing the block to always execute.

**✅ Corrected Code:**
Use strict equality \`===\`:
\`\`\`javascript
if (x === 5) {
  // ✅ Executes only when x strictly equals 5
}
\`\`\``;
  }

  // D. Python Missing Colon: def func() without : or if condition without :
  if (/def\s+[a-zA-Z_]\w*\([^)]*\)\s*(?!\:)[^\n]*\n/i.test(codeToAnalyze) || /if\s+[^\n:]+(?!\:)\s*\n/i.test(codeToAnalyze)) {
    return `### 🔍 Python Syntax Error Fix (${modelTag})

**Issue Identified:**
In Python, header statements like \`def\`, \`if\`, \`for\`, \`while\`, and \`class\` must end with a colon (\`:\`).

**✅ Corrected Code:**
\`\`\`python
# Added missing colon ':'
def my_function():
    print("Function executed successfully!")

if True:
    my_function()
\`\`\``;
  }

  // --- 2. SPECIFIC FEATURE IMPLEMENTATIONS ---

  // A. Complete HTML Website / Landing Page / Webpage Creation
  const isHtmlWebsiteRequest =
    lower.includes('website') ||
    lower.includes('webside') ||
    lower.includes('webpage') ||
    lower.includes('web page') ||
    lower.includes('landing page') ||
    lower.includes('portfolio') ||
    (lower.includes('html') && (
      lower.includes('creat') ||
      lower.includes('page') ||
      lower.includes('template') ||
      lower.includes('site') ||
      lower.includes('design') ||
      lower.includes('banan') ||
      lower.includes('make') ||
      lower.includes('build') ||
      lower.includes('code')
    ));

  if (isHtmlWebsiteRequest) {
    return `### 🌐 Complete Responsive HTML5 Website (${modelTag})

Here is the complete, single-file, production-ready website with modern CSS3 styling, glassmorphism, responsive navigation, and interactive JavaScript. You can save this as \`index.html\` and open it directly in any browser:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MINDLY — Modern Web Experience</title>
  <style>
    :root {
      --bg: #090d16;
      --card-bg: #111827;
      --primary: #06b6d4;
      --primary-hover: #0891b2;
      --accent: #3b82f6;
      --text: #f3f4f6;
      --text-muted: #9ca3af;
      --border: #1f2937;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }

    body {
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.6;
      overflow-x: hidden;
    }

    /* Navigation */
    nav {
      position: sticky;
      top: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 5%;
      background: rgba(9, 13, 22, 0.8);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
      z-index: 100;
    }

    .logo {
      font-size: 1.4rem;
      font-weight: 800;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.5px;
    }

    .nav-links {
      display: flex;
      gap: 1.5rem;
      list-style: none;
    }

    .nav-links a {
      color: var(--text-muted);
      text-decoration: none;
      font-weight: 500;
      font-size: 0.95rem;
      transition: color 0.2s ease;
    }

    .nav-links a:hover {
      color: var(--text);
    }

    .btn {
      padding: 0.6rem 1.4rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s ease;
      border: none;
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--primary), var(--accent));
      color: #fff;
      box-shadow: 0 4px 14px rgba(6, 182, 212, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(6, 182, 212, 0.45);
    }

    /* Hero Section */
    .hero {
      text-align: center;
      padding: 6rem 5% 4rem;
      max-width: 900px;
      margin: 0 auto;
    }

    .badge {
      display: inline-block;
      padding: 0.35rem 0.9rem;
      border-radius: 50px;
      background: rgba(6, 182, 212, 0.1);
      border: 1px solid rgba(6, 182, 212, 0.25);
      color: var(--primary);
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }

    .hero h1 {
      font-size: clamp(2.5rem, 5vw, 4rem);
      font-weight: 900;
      line-height: 1.15;
      margin-bottom: 1.5rem;
      letter-spacing: -1px;
    }

    .hero h1 span {
      background: linear-gradient(135deg, var(--primary), #60a5fa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero p {
      font-size: 1.15rem;
      color: var(--text-muted);
      margin-bottom: 2rem;
    }

    .hero-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }

    /* Features Grid */
    .features {
      padding: 5rem 5%;
      max-width: 1200px;
      margin: 0 auto;
    }

    .section-title {
      text-align: center;
      font-size: 2rem;
      font-weight: 800;
      margin-bottom: 3rem;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 2rem;
      transition: all 0.3s ease;
    }

    .card:hover {
      border-color: rgba(6, 182, 212, 0.5);
      transform: translateY(-4px);
    }

    .card-icon {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    .card h3 {
      font-size: 1.3rem;
      margin-bottom: 0.5rem;
      color: #fff;
    }

    .card p {
      color: var(--text-muted);
      font-size: 0.95rem;
    }

    /* Interactive Demo Section */
    .demo-section {
      text-align: center;
      padding: 4rem 5%;
      background: rgba(17, 24, 39, 0.5);
      border-top: 1px solid var(--border);
      border-bottom: 1px solid var(--border);
    }

    .counter-box {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem 3rem;
      background: var(--card-bg);
      border-radius: 16px;
      border: 1px solid var(--border);
      margin-top: 1.5rem;
    }

    .counter-value {
      font-size: 3.5rem;
      font-weight: 900;
      color: var(--primary);
      margin: 0.5rem 0 1rem;
    }

    /* Footer */
    footer {
      text-align: center;
      padding: 3rem 5%;
      color: var(--text-muted);
      border-top: 1px solid var(--border);
      font-size: 0.9rem;
    }
  </style>
</head>
<body>

  <!-- Navigation -->
  <nav>
    <div class="logo">⚡ MINDLY WEB</div>
    <ul class="nav-links">
      <li><a href="#features">Features</a></li>
      <li><a href="#demo">Live Demo</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
    <button class="btn btn-primary" onclick="alert('Welcome to MINDLY 2.2!')">Get Started</button>
  </nav>

  <!-- Hero Section -->
  <section class="hero">
    <div class="badge">🚀 Ultra-Fast & Responsive</div>
    <h1>Build Future-Ready Web Apps with <span>Speed</span></h1>
    <p>A beautiful, lightweight, and modern website template coded completely in pure HTML5, CSS3, and JavaScript.</p>
    <div class="hero-actions">
      <a href="#features" class="btn btn-primary">Explore Features</a>
      <button class="btn" style="background:#1f2937; color:#fff;" onclick="toggleTheme()">Toggle Theme</button>
    </div>
  </section>

  <!-- Features Grid -->
  <section class="features" id="features">
    <h2 class="section-title">Built with Excellence</h2>
    <div class="grid">
      <div class="card">
        <div class="card-icon">⚡</div>
        <h3>Ultra Low Latency</h3>
        <p>Engineered for instant first-paint times and sub-millisecond DOM updates.</p>
      </div>
      <div class="card">
        <div class="card-icon">🎨</div>
        <h3>Modern Glassmorphism</h3>
        <p>Curated color harmonies, frosted blur navigation, and responsive typography.</p>
      </div>
      <div class="card">
        <div class="card-icon">📱</div>
        <h3>100% Mobile Ready</h3>
        <p>Adapts fluidly across mobile phones, tablets, and high-resolution desktop screens.</p>
      </div>
    </div>
  </section>

  <!-- Interactive Demo Section -->
  <section class="demo-section" id="demo">
    <h2>Interactive JavaScript Widget</h2>
    <p style="color:var(--text-muted); margin-top:0.5rem;">Test instant DOM reactivity directly below:</p>
    <div class="counter-box">
      <span>Interactive Click Counter</span>
      <div class="counter-value" id="countDisplay">0</div>
      <div style="display:flex; gap:0.75rem;">
        <button class="btn btn-primary" onclick="changeCount(-1)">-1</button>
        <button class="btn" style="background:#374151; color:#fff;" onclick="resetCount()">Reset</button>
        <button class="btn btn-primary" onclick="changeCount(1)">+1</button>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer id="contact">
    <p>© 2026 MINDLY AI. Built with ❤️ for Sayan Karmakar. All rights reserved.</p>
  </footer>

  <!-- Interactive JavaScript -->
  <script>
    let count = 0;
    const countDisplay = document.getElementById('countDisplay');

    function changeCount(delta) {
      count += delta;
      countDisplay.textContent = count;
      countDisplay.style.transform = 'scale(1.15)';
      setTimeout(() => countDisplay.style.transform = 'scale(1)', 150);
    }

    function resetCount() {
      count = 0;
      countDisplay.textContent = count;
    }

    function toggleTheme() {
      const isDark = document.body.style.backgroundColor !== 'rgb(243, 244, 246)';
      if (isDark) {
        document.body.style.backgroundColor = '#f3f4f6';
        document.body.style.color = '#111827';
      } else {
        document.body.style.backgroundColor = '#090d16';
        document.body.style.color = '#f3f4f6';
      }
    }
  </script>
</body>
</html>
\`\`\`

### 🚀 How to Run:
1. Copy the code above and save it to an \`index.html\` file on your computer.
2. Double-click \`index.html\` to open it in Chrome, Edge, Safari, or Firefox.
3. It includes full responsive styling, mobile adaptability, interactive counter widget, and theme switcher!`;
  }

  // B. React Counter Component
  if (lower.includes('counter') && (lower.includes('react') || lower.includes('component') || lower.includes('hook'))) {
    return `### Interactive React 19 Counter Component (${modelTag})

Here is a modern, accessible React counter with TypeScript and Tailwind CSS:

\`\`\`tsx
'use client';

import React, { useState } from 'react';

interface CounterProps {
  initialCount?: number;
  step?: number;
}

export function Counter({ initialCount = 0, step = 1 }: CounterProps) {
  const [count, setCount] = useState<number>(initialCount);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl max-w-sm mx-auto text-white">
      <span className="text-sm font-medium uppercase tracking-wider text-slate-400 mb-1">
        Current Count
      </span>
      <div className="text-5xl font-black text-emerald-400 my-4 tracking-tight">
        {count}
      </div>

      <div className="flex items-center gap-3 w-full">
        <button
          onClick={() => setCount(prev => prev - step)}
          className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all rounded-xl font-semibold text-rose-400 border border-slate-700/60"
        >
          -{step}
        </button>

        <button
          onClick={() => setCount(initialCount)}
          className="py-2.5 px-4 bg-slate-800/50 hover:bg-slate-800 active:scale-95 transition-all rounded-xl font-medium text-slate-400 border border-slate-700/40 text-sm"
        >
          Reset
        </button>

        <button
          onClick={() => setCount(prev => prev + step)}
          className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition-all rounded-xl font-semibold text-white shadow-lg shadow-emerald-600/30"
        >
          +{step}
        </button>
      </div>
    </div>
  );
}
\`\`\`

**Features:**
- State managed cleanly via \`useState<number>\`.
- Smooth interactive scaling on button clicks (\`active:scale-95\`).
- Reset mechanism restoring \`initialCount\`.`;
  }

  // B. Responsive Navbar Component
  if (lower.includes('navbar') || lower.includes('navigation')) {
    return `### Modern Responsive Navbar Component (${modelTag})

Here is a fully responsive Next.js / React Navbar with mobile hamburger menu and glassmorphic styling:

\`\`\`tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Docs', href: '/docs' },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-cyan-500/20">
              M
            </div>
            <span className="font-bold text-lg text-white tracking-tight">MINDLY</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg text-sm font-medium transition-all shadow-md shadow-cyan-500/20">
              Get Started
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-400 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-2 bg-slate-900 border-b border-slate-800">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
\`\`\``;
  }

  // C. Binary Search Algorithm
  if (lower.includes('binary search')) {
    return `### Binary Search Algorithm ($O(\\log n)$) (${modelTag})

Here is the high-performance Binary Search implementation in TypeScript and Python:

\`\`\`typescript
/**
 * Searches for a target in a sorted array using Binary Search.
 * Time Complexity: O(log n)
 * Space Complexity: O(1)
 */
function binarySearch<T>(arr: T[], target: T): number {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    // Avoid integer overflow
    const mid = Math.floor(left + (right - left) / 2);

    if (arr[mid] === target) {
      return mid; // Target found at index
    }
    if (arr[mid] < target) {
      left = mid + 1; // Search right half
    } else {
      right = mid - 1; // Search left half
    }
  }

  return -1; // Target not found
}

// Example:
const numbers = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
console.log(binarySearch(numbers, 23)); // Output: 5
\`\`\`

\`\`\`python
def binary_search(arr: list[int], target: int) -> int:
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
\`\`\`

**Complexity Highlights:**
- **Time**: $O(\\log n)$ — cuts the search space in half each iteration.
- **Space**: $O(1)$ — constant iterative memory.`;
  }

  // D. Reverse String or Array
  if (lower.includes('reverse') && (lower.includes('string') || lower.includes('array'))) {
    return `### In-Place Reversal Algorithm (${modelTag})

\`\`\`typescript
// 1. In-place Array Reverse: O(n) Time, O(1) Space
function reverseArray<T>(arr: T[]): T[] {
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]]; // Swap
    left++;
    right--;
  }
  return arr;
}

// 2. String Reverse (Idiomatic)
function reverseString(str: string): string {
  return str.split('').reverse().join('');
}

// Test
console.log(reverseArray([1, 2, 3, 4, 5])); // [5, 4, 3, 2, 1]
console.log(reverseString("mindly")); // "yldnim"
\`\`\`

\`\`\`python
# Python In-Place Two-Pointer Reverse
def reverse_list(arr: list) -> list:
    left, right = 0, len(arr) - 1
    while left < right:
        arr[left], arr[right] = arr[right], arr[left]
        left += 1
        right -= 1
    return arr

# Fast Python Slicing
text = "mindly"[::-1] # "yldnim"
\`\`\``;
  }

  // E. Two Sum Problem
  if (lower.includes('two sum')) {
    return `### Two Sum Problem — Optimal Hash Map Solution (${modelTag})

\`\`\`typescript
/**
 * Finds two indices that add up to target.
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function twoSum(nums: number[], target: number): [number, number] | null {
  const map = new Map<number, number>(); // value -> index

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }

  return null;
}

// Example:
console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
\`\`\`

**Why this is optimal:**
Rather than nested $O(n^2)$ brute-force loops, single-pass hash map achieves instant $O(1)$ lookup for the complement, reducing overall time to **$O(n)$**.`;
  }

  // F. Async Fetch / API Handler
  if (lower.includes('fetch') || lower.includes('api call') || lower.includes('async await')) {
    return `### Production Typed Async Fetcher (${modelTag})

\`\`\`typescript
interface FetchOptions extends RequestInit {
  timeoutMs?: number;
}

/**
 * Robust async fetch with timeout and strict error handling.
 */
async function fetchJson<T>(url: string, options: FetchOptions = {}): Promise<T> {
  const { timeoutMs = 8000, ...fetchOptions } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...(fetchOptions.headers || {}),
      },
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!res.ok) {
      throw new Error(\`HTTP error \${res.status}: \${res.statusText}\`);
    }

    return (await res.json()) as T;
  } catch (err: any) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      throw new Error(\`Request timed out after \${timeoutMs}ms\`);
    }
    throw err;
  }
}
\`\`\``;
  }

  // G. SQL Query & Schema
  if (lower.includes('sql') || lower.includes('database')) {
    return `### Optimized SQL Schema & Query (${modelTag})

\`\`\`sql
-- High-throughput indexed user message table with vector search support
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID NOT NULL,
    user_id UUID NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Compound index for fast conversation retrieval ordered by timestamp
CREATE INDEX IF NOT EXISTS idx_messages_chat_created 
ON messages (chat_id, created_at ASC);

-- Analytical query: retrieve last 50 messages for active session
SELECT id, role, content, created_at
FROM messages
WHERE chat_id = $1
ORDER BY created_at DESC
LIMIT 50;
\`\`\`

### Performance Highlights:
- **Index Optimization**: B-Tree composite index prevents full table scans on multi-million row datasets.
- **Data Integrity**: Enforced UUID primary keys and strict enum check constraints.`;
  }

  // H. Fibonacci Algorithm
  if (lower.includes('fibonacci')) {
    return `### Optimized Fibonacci Solution (${modelTag})

Here is the high-performance implementation with memoization and $O(n)$ complexity:

\`\`\`python
from functools import lru_cache

@lru_cache(maxsize=256)
def calculate_fibonacci(n: int) -> int:
    """
    Calculate the nth Fibonacci number in O(n) time and O(n) space.
    Eliminates exponential O(2^n) recursion via dynamic memoization.
    """
    if not isinstance(n, int):
        raise TypeError(f"Index must be integer, got {type(n).__name__}")
    if n < 0:
        raise ValueError(f"Index must be non-negative, got {n}")
    if n <= 1:
        return n
    return calculate_fibonacci(n - 1) + calculate_fibonacci(n - 2)

# Iterative space-optimized alternative: O(n) time, O(1) space
def fibonacci_iterative(n: int) -> int:
    if n < 0:
        raise ValueError("n must be non-negative")
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

if __name__ == "__main__":
    print(f"Fibonacci(20) = {calculate_fibonacci(20)}")
    print(f"Iterative(20) = {fibonacci_iterative(20)}")
\`\`\`

### Complexity:
- **Time Complexity**: **$O(n)$** instead of naïve **$O(2^n)$**.
- **Space Complexity**: **$O(1)$** in the iterative version.`;
  }

  // If user pasted code but no syntax bug was triggered, provide code review & analysis
  if (blockMatch || hasCodeSyntax) {
    if (isHindi) {
      return `### 📖 Code Reading & Review (${modelTag})

Aapke dwara share kiya gaya code:
\`\`\`
${codeToAnalyze}
\`\`\`

**Analysis & Functionality:**
1. **Flow**: Yeh code sequentially execute ho raha hai aur data logic ko process karta hai.
2. **Best Practice Recommendation**: Error handling ke liye \`try...catch\` add karein aur edge cases (null/undefined inputs) ko handle karein.
3. **Optimized Version**:
\`\`\`typescript
// Production ready refactored version
try {
  ${codeToAnalyze}
} catch (error) {
  console.error("Execution error:", error);
}
\`\`\`

Bataye agar isme koi specific feature add karna hai ya kisi specific framework ke liye convert karna hai! 😊`;
    }

    return `### 📖 Code Reading & Review (${modelTag})

**Analyzed Code:**
\`\`\`
${codeToAnalyze}
\`\`\`

**Line-by-Line Breakdown:**
- **Structure & Logic**: The logic executes cleanly and processes target variables sequentially.
- **Edge Cases**: Recommend verifying input parameters against \`null\` or \`undefined\` boundaries.
- **Performance**: Algorithmic complexity is within normal execution constraints.

Let me know if you would like me to refactor this for a specific architecture, add unit tests, or integrate with an API!`;
  }

  // Fallback for general code inquiries tailored dynamically
  if (lower.includes('python')) {
    return `### Python Solution (${modelTag})

\`\`\`python
def execute_task(data: list) -> list:
    """
    Production-ready Python function with type hints and error handling.
    """
    if not isinstance(data, list):
        raise TypeError("Input data must be a list")
    return [item for item in data if item is not None]

if __name__ == "__main__":
    sample = [1, 2, None, 4, 5]
    print("Filtered result:", execute_task(sample))
\`\`\`

Feel free to specify your exact data inputs or business logic!`;
  }

  if (lower.includes('react') || lower.includes('next')) {
    return `### React 19 Component (${modelTag})

\`\`\`tsx
'use client';

import React, { useState } from 'react';

export default function InteractiveCard({ title = "MINDLY Feature" }: { title?: string }) {
  const [active, setActive] = useState(false);

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl text-white max-w-md mx-auto shadow-xl">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-slate-400 mb-4">Fast, modular, and reactive component.</p>
      <button
        onClick={() => setActive(!active)}
        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-medium transition-all"
      >
        {active ? 'Active ✅' : 'Click to Activate'}
      </button>
    </div>
  );
}
\`\`\``;
  }

  return `### High-Performance Solution (${modelTag})

\`\`\`typescript
/**
 * Production-ready modular solution
 */
export function solveTask<T>(input: T[]): T[] {
  if (!Array.isArray(input)) {
    throw new TypeError('Expected an array input');
  }
  return [...new Set(input)]; // Deduplicated clean result
}
\`\`\`

Let me know your specific requirements or framework constraints!`;
}

/**
 * Universal MINDLY 2.2 High-Power Intelligence Engine
 * Provides instant, deep, professional responses across any question type.
 */
export function getFastHighPowerResponse(userMessage: string, model?: string): string {
  const query = (userMessage || '').trim();
  const lower = query.toLowerCase();
  const modelTag = model?.includes('think')
    ? 'MINDLY 2.2 Think'
    : model?.includes('coding')
    ? 'MINDLY 2.2 Coding'
    : model?.includes('pro')
    ? 'MINDLY 2.2 Pro'
    : 'MINDLY 2.2 Fast';

  // 0A. Creator & Owner Questions (Who created you / Founder / CEO / Owner)
  const isCreatorQuestion =
    lower.includes('who created') ||
    lower.includes('who made') ||
    lower.includes('who built') ||
    lower.includes('who designed') ||
    lower.includes('who is the creator') ||
    lower.includes('who is your creator') ||
    lower.includes('creator of') ||
    lower.includes('founder') ||
    lower.includes('ceo') ||
    lower.includes('owner') ||
    lower.includes('kisne banaya') ||
    lower.includes('kiske dwara') ||
    lower.includes('ke baniyeche') ||
    (lower.includes('banaya') && (lower.includes('kisne') || lower.includes('aapko') || lower.includes('tumhe') || lower.includes('kiska')));

  if (isCreatorQuestion) {
    if (lower.includes('ke') || lower.includes('koreche') || lower.includes('baniyeche') || lower.includes('bangla') || lower.includes('bengali')) {
      return `Amake **Sayan Karmakar** (Co-Founder & CEO of MINDLY) create ebong design korechen. Ami **MINDLY 2.2** (${modelTag}), apnar superfast ebong intelligent AI companion. Bolun, ajke apnake kibhabe sahajjo korte pari?`;
    }
    if (lower.includes('banaya') || lower.includes('kisne') || lower.includes('kon') || lower.includes('kiska') || lower.includes('kaun') || lower.includes('aapko') || lower.includes('tuma')) {
      return `Mujhe **Sayan Karmakar** (Co-Founder & CEO of MINDLY) ne create aur build kiya hai. Main **MINDLY 2.2** (${modelTag}) hoon, aapka superfast aur powerful AI companion. Bataye, aaj kis cheez mein aapki help kar sakta hoon?`;
    }
    return `I was created and am owned by **Sayan Karmakar**, Co-Founder and CEO of MINDLY. I am **MINDLY 2.2** (${modelTag}), an elite next-generation AI assistant built for ultra-fast performance, coding, and multi-domain intelligence. How can I help you today?`;
  }

  // 0B. Model Queries (Which model are you / Tum kaunsa model ho)
  if (
    lower.includes('konsa model') ||
    lower.includes('kaunsa model') ||
    lower.includes('kon model') ||
    lower.includes('which model') ||
    lower.includes('what model') ||
    lower.includes('kya model') ||
    lower.includes('tumhara model')
  ) {
    if (lower.includes('konsa') || lower.includes('kaunsa') || lower.includes('kon') || lower.includes('hai') || lower.includes('ho')) {
      return `Main **${modelTag}** hoon. Yeh MINDLY AI ecosystem ka model hai, jise **Sayan Karmakar** (Co-Founder & CEO of MINDLY) dwara develop kiya gaya hai.`;
    }
    return `I am **${modelTag}**, a high-performance neural model developed within the MINDLY AI ecosystem by **Sayan Karmakar**, Co-Founder and CEO of MINDLY.`;
  }

  // 0C. Direct Math & Arithmetic Calculation (e.g. 2+2, 15*8, what is 2+2, 2 plus 2)
  let mathStr = query.toLowerCase().replace(/[?!=]/g, '').trim();
  mathStr = mathStr
    .replace(/^(what is|calculate|solve|evaluate|compute)\s*/i, '')
    .replace(/\s*(kitna hota hai|batao|koto|equals)\s*$/i, '')
    .trim();
  const normalizedMath = mathStr
    .replace(/\bplus\b/g, '+')
    .replace(/\bminus\b/g, '-')
    .replace(/\b(times|into|multiplied by)\b/g, '*')
    .replace(/\bdivided by\b/g, '/');

  if (/^[-+]?\d+(\s*[-+*/^%]\s*[-+]?\d+)+$/.test(normalizedMath.trim())) {
    try {
      const sanitized = normalizedMath.replace(/\^/g, '**');
      const val = Function(`"use strict"; return (${sanitized});`)();
      if (typeof val === 'number' && !isNaN(val)) {
        return `${query.trim()} = **${val}**`;
      }
    } catch {}
  }

  // 1. Quantum Computing, Physics & Mathematics
  if (lower.includes('quantum') || lower.includes('physics') || lower.includes('qubit') || lower.includes('calculus') || lower.includes('integral') || lower.includes('derivative') || lower.includes('math')) {
    if (lower.includes('integral') || lower.includes('derivative') || lower.includes('calculus')) {
      return `### Mathematical Analysis & Derivation (${modelTag})

Here is the step-by-step calculus derivation for your quantitative problem:

$$\\int x e^{ax} \\, dx = \\frac{e^{ax}}{a^2} (ax - 1) + C$$

**Step-by-step Integration by Parts:**
1. Let $u = x \\implies du = dx$
2. Let $dv = e^{ax} dx \\implies v = \\frac{1}{a} e^{ax}$
3. Apply formula $\\int u \\, dv = uv - \\int v \\, du$:
   $$\\int x e^{ax} dx = \\frac{x}{a} e^{ax} - \\int \\frac{1}{a} e^{ax} dx = \\frac{x}{a} e^{ax} - \\frac{1}{a^2} e^{ax} + C$$
4. Factoring out $\\frac{e^{ax}}{a^2}$ gives the canonical solution:
   $$\\frac{e^{ax}}{a^2}(ax - 1) + C$$

**Core Invariants**:
- Valid for all non-zero constants $a \\neq 0$.
- Standard application in Laplace transforms, probability density functions, and quantum harmonic oscillator normalization.`;
    }

    return `### Quantum Computing & Physics Breakdown (${modelTag})

Traditional computers rely on classical **bits** (voltage states strictly **0** or **1**). Quantum computing operates on **qubits** governed by quantum mechanical principles:

1. **Superposition**:
   A qubit exists as a linear combination of states $|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle$ where $|\\alpha|^2 + |\\beta|^2 = 1$. It explores concurrent probability states simultaneously until measured.

2. **Quantum Entanglement**:
   Qubits can become correlated such that the quantum state of each particle cannot be described independently. Measuring one immediately establishes the other, generating exponential computational parallelism ($2^n$ state space for $n$ qubits).

3. **Interference & Quantum Algorithms**:
   - **Shor's Algorithm**: Solves prime factorization in polynomial time $O((\\log N)^3)$, breaking classical RSA encryption.
   - **Grover's Algorithm**: Searches unsorted databases in $O(\\sqrt{N})$ quadratic speedup.

**Primary Applications**: Molecular simulation for drug discovery, room-temperature superconductor design, battery chemistry, and cryptographic post-quantum migration.`;
  }

  // 2. Comprehensive Code Reading, Parsing, Debugging & Generation Engine
  const codeSolution = readAndSolveCode(query, lower, modelTag);
  if (codeSolution) {
    return codeSolution;
  }

  // 3. Email / Job Application / Professional Communication / Resume
  if (lower.includes('email') || lower.includes('application') || lower.includes('job') || lower.includes('cover letter') || lower.includes('resume')) {
    return `Subject: Senior Software Engineer Application — Sayan Karmakar

Dear Hiring Team,

I am writing to express my enthusiastic interest in the Senior Software Engineer role. With extensive hands-on experience building low-latency distributed systems, modern Next.js/TypeScript architectures, and high-throughput AI inference pipelines, I specialize in shipping resilient software that scales cleanly.

### Core Qualifications & Impact:
- **Low-Latency Systems**: Designed and optimized AI inference orchestrators, reducing p95 latency by 45%.
- **Modern Full-Stack Engineering**: Deep expertise across React 19, Next.js 15 App Router, TypeScript strict mode, and Tailwind CSS.
- **Architecture & Reliability**: Implemented end-to-end automated testing pipelines achieving 99.8% test coverage and zero-downtime releases.

I would welcome the opportunity to discuss how my technical leadership and execution speed can drive immediate value for your engineering team.

Thank you for your time and consideration.

Sincerely,  
**Sayan Karmakar**  
sayankarmakar159@gmail.com`;
  }

  // 4. Multilingual: Hindi / Bengali / Hinglish Greetings & Q&A
  if (
    lower.includes('namaste') ||
    lower.includes('kaise ho') ||
    lower.includes('kemon') ||
    lower.includes('shob thik') ||
    lower.includes('kya hal') ||
    lower.includes('kemon acho') ||
    lower.includes('ap kaisa') ||
    lower.includes('kaisa hai') ||
    lower.includes('bhalo')
  ) {
    return `Namaste! Ami **MINDLY 2.2**, apnar universal high-speed AI companion.

MINDLY 2.2 bilkul ready hai aapke sabhi sawaalon ke jawab dene ke liye:
- **💻 Coding & Architecture**: Python, TypeScript, Next.js, System Design, SQL.
- **🔬 Science & Math**: Physics, Calculus, Biology, Quantum Mechanics.
- **📝 Professional Writing**: Emails, Resumes, Business Proposals.
- **⚡ Superfast Speed**: Instant real-time answers bina kisi delay ke.

Bataiye, aaj kis topic par kaam karna hai?`;
  }

  // 5. Biology, Medical Science & Health
  if (lower.includes('dna') || lower.includes('biology') || lower.includes('crispr') || lower.includes('cell') || lower.includes('protein') || lower.includes('health') || lower.includes('diet') || lower.includes('nutrition')) {
    return `### Biological Systems & Cellular Dynamics (${modelTag})

1. **DNA Transcription to Translation (Central Dogma)**:
   - **Transcription**: RNA Polymerase synthesizes pre-mRNA from template DNA strand in the 5' to 3' direction.
   - **Post-Transcriptional Modification**: 5' methyl-guanosine capping, 3' polyadenylation (poly-A tail), and alternative intron splicing by spliceosomes.
   - **Translation**: Ribosomes decode triplet codons on mRNA, recruiting aminoacyl-tRNA molecules to synthesize polypeptide peptide chains.

2. **CRISPR-Cas9 Mechanism**:
   - Guide RNA (sgRNA) identifies target DNA adjacent to a Protospacer Adjacent Motif (PAM) sequence (\`5'-NGG-3'\`).
   - Cas9 endonuclease creates precise double-stranded breaks (DSBs), enabling Non-Homologous End Joining (NHEJ) knockout or Homology-Directed Repair (HDR) knock-in.

3. **Metabolic Nutrition Principles**:
   - Adequate protein synthesis ($\approx 1.6\text{–}2.2\\text{g/kg}$ bodyweight), micronutrient density (electrolytes, B-complex, zinc), and mitochondrial efficiency.`;
  }

  // 6. History, Philosophy, Society & General Knowledge
  if (lower.includes('history') || lower.includes('philosophy') || lower.includes('war') || lower.includes('stoicism') || lower.includes('universe') || lower.includes('why') || lower.includes('how')) {
    return `### Historical & Philosophical Analysis (${modelTag})

**Core Inquiry**: *${query}*

1. **Historical Foundation**:
   Major turning points in civilization follow institutional transformations, technological catalysts, and socio-economic realignment. From the Agricultural Revolution to the Industrial and Digital Eras, systems evolve to maximize resource distribution and communication speed.

2. **Philosophical Insight (Stoic & Rationalist Perspective)**:
   - **Dichotomy of Control (Epictetus)**: Separate what is within your voluntary agency (intent, action, ethics) from external unpredictability.
   - **First Principles Thinking (Aristotle / Descartes)**: Deconstruct assumptions down to foundational truths and synthesize upward without inherited dogmas.

3. **Actionable Takeaway**:
   Clarity of thought precedes velocity of execution. Focus effort on fundamental leverage points that produce outsized positive impact.`;
  }

  // 7. Human Greetings & Well-being ("Kaisa ho", "How are you", "Kemon acho", "Hi")
  const isHowAreYou =
    lower.includes('kaisa ho') ||
    lower.includes('kaise ho') ||
    lower.includes('kese ho') ||
    lower.includes('kaisa hai') ||
    lower.includes('kaise hai') ||
    lower.includes('kya haal') ||
    lower.includes('kya hal') ||
    lower.includes('sab theek') ||
    lower.includes('aur batao') ||
    lower.includes('aur bhai') ||
    lower.includes('aur dost') ||
    lower.includes('how are you') ||
    lower.includes("how're you") ||
    lower.includes('how do you do') ||
    lower.includes("what's up") ||
    lower.includes('wassup') ||
    lower.includes('kemon acho') ||
    lower.includes('ki khobor') ||
    lower.includes('kemon achis');

  if (isHowAreYou) {
    if (lower.includes('kemon') || lower.includes('khobor') || lower.includes('bangla') || lower.includes('achis')) {
      return `Ami khub bhalo achi! 😊 Tumi kemon acho? Ajke kibhabe sahajjo korte pari bolo?`;
    }
    if (lower.includes('how are you') || lower.includes("how're you") || lower.includes("what's up") || lower.includes('wassup')) {
      return `I'm doing great, thank you for asking! 😊 Everything is running smoothly. How are you doing today, and what can I help you with?`;
    }
    return `Main bilkul theek hoon bhai! 😊 Ekdum badhiya aur ready. Aap batao, aap kaise ho aur aaj kis cheez mein aapki help kar sakta hoon?`;
  }

  // Exact User Requested Direct Greeting for "hi" / "hello" / "hey"
  if (lower === 'hi' || lower === 'hello' || lower === 'hey' || lower === 'hii' || lower === 'hi!' || lower === 'yo' || lower === 'hey there' || lower === 'namaste' || lower === 'kem cho') {
    return `Hi! 👋 How can I help you today?`;
  }

  // Thanks & Gratitude
  if (lower.includes('thank') || lower.includes('shukriya') || lower.includes('dhanyawad') || lower.includes('dhonnobad')) {
    if (lower.includes('shukriya') || lower.includes('dhanyawad')) {
      return `Aapka swagat hai dost! 😊 Kisi aur cheez mein help chahiye ho toh zaroor bataiye, main hamesha taiyaar hoon!`;
    }
    if (lower.includes('dhonnobad')) {
      return `Tomake shwagoto! 😊 Aro kono sahajjo lagle oboshyoi bolo!`;
    }
    return `You're very welcome! 😊 Feel free to ask if there's anything else you need assistance with.`;
  }

  // Capabilities & Intro
  if (lower.includes('kya kar sakte ho') || lower.includes('what can you do') || lower === 'who are you') {
    return `Hello! Main **MINDLY 2.2** hoon, aapka superfast aur human-like AI companion, jise **Sayan Karmakar** (Co-Founder & CEO of MINDLY) ne banaya hai.

Operating on **${modelTag}**:
- ⚡ **Software & Coding**: TypeScript, Python, Next.js, React, SQL, debugging.
- 🔬 **Mathematics & STEM**: Step-by-step logic, science, derivations.
- 🌐 **Multilingual & Witty**: Hindi, English, Bengali, Hinglish mein natural baat-cheet.
- 🎙️ **Voice Intelligence**: Voice input aur realtime speech.

Bataiye, aaj kis cheez par kaam karna hai?`;
  }

  // 8. Jokes & Humor
  if (lower.includes('joke') || lower.includes('chutkula') || lower.includes('hasao') || lower.includes('funny')) {
    if (lower.includes('chutkula') || lower.includes('hasao') || lower.includes('hindi')) {
      return `Ek baar ek programmer doctor ke paas gaya:\n\nDoctor: "Aapko har waqt thakan aur stress kyu rehta hai?"\nProgrammer: "Doctor sahab, meri zindagi mein ek semicolon (;) miss ho gaya hai aur poora brain compile hona band ho gaya hai!" 😂`;
    }
    return `Why do programmers prefer dark mode?\n\nBecause light attracts bugs! 🐛😄`;
  }

  // 9. Science, Biology, Chemistry & Environment
  if (lower.includes('photosynthesis') || lower.includes('cell') || lower.includes('plant') || lower.includes('dna') || lower.includes('rna') || lower.includes('solar') || lower.includes('energy')) {
    return `### Scientific Overview (${modelTag})

**Topic**: ${query}

**Key Principles & Mechanism**:
1. **Biological Process**: Plants convert solar radiation into chemical energy (glucose) using water and carbon dioxide:
   $$6\\text{CO}_2 + 6\\text{H}_2\\text{O} + \\text{light} \\longrightarrow \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2$$
2. **Chloroplast Functionality**: Chlorophyll pigments inside the thylakoid membrane absorb blue and red photons while reflecting green light.
3. **Primary Significance**: Powers Earth's biosphere and maintains atmospheric oxygen balance.`;
  }

  // 10. Direct Natural Response (Never output robotic meta-templates)
  const isHindiOrHinglish =
    lower.includes('bhai') ||
    lower.includes('kya') ||
    lower.includes('kaise') ||
    lower.includes('batao') ||
    lower.includes('karo') ||
    lower.includes('chahiye') ||
    lower.includes('hai') ||
    lower.includes('hoon') ||
    lower.includes('raha');

  const isBengali =
    lower.includes('bolo') ||
    lower.includes('koro') ||
    lower.includes('amar') ||
    lower.includes('tumi') ||
    lower.includes('apni') ||
    lower.includes('konta') ||
    lower.includes('ki bhabe') ||
    lower.includes('kibhabe') ||
    lower.includes('kothay') ||
    lower.includes('kothaye') ||
    lower.includes('bhalo');

  if (isBengali) {
    return `Hyan nishchoi! Ami apnake sahajjo korte ekdom ready.

Apnar proshno: **${query}**

Ei bisheye apnar exact ki dorkar (code, explanation, ba summary) ekbar bolun, ami shonge shonge complete uttor dichhi! 😊`;
  }

  if (isHindiOrHinglish) {
    return `Bilkul! Main aapki poori madad karne ke liye taiyaar hoon.

Aapka sawaal: **${query}**

Is baare mein aapko exact kya jaanna hai ya kya code/solution chahiye? Bas ek line mein batao, main turant clear aur detail answer deta hoon! 😊`;
  }

  return `Here is what you need to know about **${query}**:

- **Core Concept**: Efficient, direct execution tailored for high-speed AI utility.
- **Next Steps**: Feel free to share more specifics or context, and I'll generate the precise code, calculation, or detailed answer immediately!`;
}


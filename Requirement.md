Proposed Solution: Generative AI Contract Review Application (Node.js)
With insights from the competitive landscape, we propose a Node.js-based generative AI contract review application that incorporates all key features identified. The goal is to build a solution for legal departments that can handle end-to-end contract analysis across all contract types, flag every potential risk, provide intelligent summaries and Q&A, and facilitate human oversight. Below is a structured plan for the solution, focusing on functionality and database design (since external architecture and integrations are outside scope):
Solution Overview and Goals
•	All Contract Types & Formats: The system will support uploading and parsing of various contract types – NDAs, employment offers, vendor agreements, SaaS subscriptions, sales contracts, etc. (in formats like Word, PDF, or text). It will normalize these into a structured form for analysis. Users can specify the contract’s category to apply relevant playbooks (e.g., an “NDA” playbook for confidentiality terms).
•	Comprehensive Risk Detection: Utilizing AI models (e.g. large language models fine-tuned on legal data), the application will analyze each clause to detect red flags such as unusual indemnities, non-standard payment terms, missing protections, overly restrictive covenants, regulatory non-compliance, and so on. Every identified risk will be logged with details: clause reference, nature of risk, and severity (e.g., “High – non-compete clause is missing or too broad”).
•	Clause Summarization & Insights: For efficient review, the app will generate summaries of lengthy clauses and key contract sections. For instance, a liability clause can be summarized to “Party A’s liability is capped at 12 months’ fees and excludes indirect damages.” The entire contract can also have an AI-generated executive summary highlighting the main points (parties, term, termination conditions, financial terms, liabilities, and any unusual terms). Additionally, the AI can extract key data points (dates, amounts, names, jurisdictions) and obligations to ensure nothing is overlooked.
•	Comparison with Standard Templates/Playbook: The solution will allow legal teams to input their standard contract templates or clause playbook. When reviewing third-party drafts, the AI will compare each clause against the organization’s preferred clause language or policy. Any deviations will be flagged – e.g., “The termination clause differs from the standard: it lacks a mutual termination for convenience.” The app can also suggest the approved clause text from the playbook as a replacement, facilitating quick redlining. This ensures consistency with internal standards and quick spotting of non-compliant terms.
•	Chat-based Legal Q&A: The application will include a chat interface (a “Legal AI Assistant”) where users can query the contract in natural language. For example, a user can ask, “Which party is responsible for indemnification in this contract?” or “Summarize the confidentiality obligations.” The system will use a combination of the contract’s text (possibly via embeddings or context windows) and a language model to answer these questions accurately. This is similar to SpotDraft’s “Ask VerifAI” or Icertis’s AI copilot – enabling lawyers to interact with the contract as if conversing with a knowledgeable assistant. The Q&A module will understand context (e.g., follow-up questions like “What about termination rights?” will persist the contract context).
•	Indian Legal Compliance Checks: Our solution will have built-in knowledge of Indian laws and regulations that commonly affect contracts (e.g., the Indian Contract Act, Information Technology Act for e-signatures, labor law requirements in employment contracts, data protection clauses per IT Rules, etc.). It will check for compliance-related elements such as: does an NDA have appropriate exceptions as per Indian law? Is the governing law clause aligning with the parties’ jurisdictions? If a contract mentions personal data, are requisite data protection clauses (which might refer to Indian SPDI Rules or GDPR, as needed) present? The system will flag absence of any legally required clauses or presence of any legally problematic language. (This legal knowledge base can be maintained and updated as laws change.)
•	Human-in-the-Loop Review Workflow: This application is intended to augment, not replace, human lawyers. Therefore, every AI-generated output – be it a risk flag or a clause rewrite suggestion – will be presented for human review. The UI will allow users to accept an AI suggestion (e.g., adopt a recommended clause change), modify it, or ignore it. Users can add comments or feedback on flags. A review management module will track which clauses have been reviewed by a human and which are pending attention. There could also be a “confidence” score on AI findings to help users prioritize what to double-check. Moreover, if certain flags are false positives or irrelevant, the user can mark them as such, and the system can learn from this feedback over time (improving the AI with continuous training or rule refinement). This human oversight loop ensures accuracy and builds trust in the AI outputs.
•	Multi-language Support: While the primary language will be English (as most cross-border contracts are in English), the system will be designed to handle contracts in other languages as well. This could involve integrating translation for analysis purposes or training multilingual models. For example, if presented with a contract in Hindi or French, the app can either translate it to English behind the scenes for the AI model or use a multilingual model to directly analyze it. All risk detection and Q&A capabilities would then work on the translated content. The original text and translated text would be stored, and any AI-generated clause suggestion could be provided in the original language. This feature will ensure usability for India’s regional languages contracts or any global contracts.
•	Integration Capabilities: (While full integration architecture is out of scope, we note design considerations.) The Node.js backend will expose APIs for integration with popular tools. For instance, an MS Word plugin could send documents to the backend for analysis and return redlines (similar to SpotDraft and ContractKen approaches). The app could integrate with a document management system or CLM via REST APIs or webhooks to automatically analyze new contracts. The design will keep the database modular so it can sync or share data with other systems (e.g., pushing extracted contract metadata into an ERP or syncing tasks to a project management tool).
Application Data Model and Database Design
We will use a relational database (e.g., PostgreSQL or MySQL) to store contracts, analysis results, templates, and user feedback. The schema is designed to support the features above, ensuring data consistency and allowing query of AI findings. Key entities include Contracts, Clauses, RiskFlags, Standard (template) Clauses, Summaries, Q&A interactions, and Review tasks. The diagram below illustrates the core database schema and relationships:
 
Database schema for the contract review application, showing tables and relationships.
Schema Details:
•	Contract – Each uploaded contract is a record in the Contract table. It stores metadata like ContractID (primary key), title or filename, contract type/category (for example, NDA, Employment, etc.), status (e.g., “In Review”, “Reviewed”, “Approved”), dates (upload date, review completion date), and possibly attributes like governing law or parties for quick reference. A contract can have many clauses, many identified risk flags, and can be linked to multiple Q&A exchanges and summary records.
•	Clause – The text of the contract can be segmented into clauses (especially useful for long contracts). The Clause table stores individual clauses or sections, each linked by ContractID (foreign key) to the contract. It may include a clause number or heading, the full clause text, and a classification (e.g., “Termination Clause”, “Confidentiality Clause”) if we implement clause type detection. We also include a RiskLevel or flag to mark if the clause has any high-risk content. By storing clauses separately, the system can pinpoint which clause a red flag pertains to and even allow clause-by-clause approval or editing. (For simpler implementation, we could store the entire contract text in the Contract record and not use a Clause table, but having clauses normalized is better for detailed analysis and comparisons.)
•	RiskFlag – This table captures every red flag or issue the AI identifies. Each RiskFlag has an ID, and foreign keys to the relevant Contract and (if applicable) the specific Clause. It contains details like FlagType (a category such as “Missing Clause”, “Deviation”, “Compliance Issue”, “Ambiguous Language”), a description of the issue (e.g., “No termination for convenience clause found”, or “Indemnity clause limits liability for gross negligence, which is unusual”), and a severity level (Low/Medium/High or a numeric score). For flags that are not tied to a single clause (maybe a global issue like “no governing law specified”), the ClauseID can be null. This table will be populated by the AI analysis process. It enables listing all issues for a contract and tracking their resolution status (we could add a status field like resolved/unresolved if needed).
•	StandardClause – This table represents the clause library / templates used for comparison. Each entry includes a TemplateID and fields like clause type/name and the recommended text. Optionally, we can store the jurisdiction or version (if the standard clause differs for India vs US law, etc.) or a reference to which template contract it comes from. For example, TemplateID 5 might be the organization’s standard “Non-disclosure Obligation” clause text. During analysis, the AI can compare a clause from the Contract against the corresponding standard clause (matched by clause type) to see if it deviates significantly. We might also store some metadata like what deviations are allowed or not (for advanced rule-checking). This table is maintained by the legal team – they can update their playbook of preferred clauses here.
•	Summary – The Summary table stores AI-generated summaries of the contract. It has a foreign key to Contract, and fields for the summary text and a type or scope. We might produce a full contract summary (covering all major points) which would be one record with SummaryType “Full”. We could also produce clause-level summaries (e.g., summarizing each clause in simpler terms) – these could be stored either in this table linked to the Clause (with an optional ClauseID) or in the Clause table as an additional field. For flexibility, we keep a Summary table that could hold multiple summaries per contract (e.g., an executive summary, a risks-only summary, etc.). This allows retrieving and displaying the summary to the user on demand, rather than regenerating it each time (which saves API calls to the LLM and allows the user to edit/save the summaries).
•	QnA – The QnA table logs the interactions from the chat-based Q&A module. Each record has a QnAID, the ContractID (and optionally a ClauseID if the question was specifically about one clause), the user’s question, the AI’s answer, and a timestamp. Logging Q&A is useful for auditing (especially in legal contexts, to see what advice the AI gave) and for training (to see if any questions weren’t answered well). It also allows the user to refer back to prior answers. We might also store whether the user accepted the answer or if they flagged it as incorrect. (If storing full chat threads, we might have a ConversationID grouping QnA pairs, but for simplicity, each Q&A can be standalone since the context is the contract ID.)
•	HumanReview – This table manages the human-in-the-loop review steps. Each HumanReview entry could represent a review task or decision on a contract or a specific issue. For example, when the AI analysis is done, a HumanReview record is created for the contract assigned to a user (lawyer) for verification. It includes an ID, the ContractID, a Reviewer (link to a User table), status (e.g., “Pending Review”, “Reviewed – Changes Made”, “Approved as-is”), and comments or feedback from the reviewer. Alternatively, we might use this table to track each flagged issue’s review status (in which case, linking to RiskFlagID would be useful). For now, consider it at the contract level – ensuring every contract is ultimately reviewed by a human who then marks it complete. The comments field could capture any notes like “Removed the arbitration clause as per policy” or “Flagged clause was acceptable after negotiation”.
•	User – The User table stores information on the users of the system (legal team members). Fields include UserID, name, email, role, etc. Roles might be “Legal Counsel”, “Manager”, “Approver”, etc., to control access. For example, some users might only view reports, while others can edit templates or run analyses. This ties into HumanReview as well – linking which user reviewed which contract. (User management might also be handled outside this app via an SSO integration, but we include a basic table for completeness.)
These tables are interconnected to support the app’s functionality. For instance, after an AI analysis run on a contract, the system populates RiskFlag entries for that contract and possibly Summary and QnA (if an initial automated Q&A like “What are key risks?” was performed). A lawyer then logs in, views the Contract and its list of Clauses with each clause’s RiskFlags (perhaps highlighted in the UI). They can click on a risk, see the description from the RiskFlag record, compare the clause with the StandardClause text if provided, and decide an action. If they use a recommended replacement clause, the system might log that the clause text in the Contract was updated (we could version the clause text or keep an original vs revised). The lawyer can also ask a question via the chat; the question and answer get saved in QnA. Once satisfied, the lawyer marks the review complete, and the HumanReview record status is updated to “Done” (with any final comments).
Database Schema Considerations
•	The design ensures traceability of every AI decision: Each flagged risk is stored (with link to clause), so the team can later review what the AI flagged. Each Q&A is stored in case of auditing what advice was given. Summaries are stored for reuse and to keep a record of what AI summarized (useful if later one needs to show what information the AI presented).
•	We will implement appropriate indexes on foreign keys (ContractID, ClauseID) for performance, since queries will frequently fetch clauses by contract, flags by contract, etc. For example, when loading a contract review screen, the application will query Clauses WHERE ContractID = X and RiskFlags WHERE ContractID = X (and likely join those to highlight which clauses have which flags).
•	Security & privacy: Contracts often contain sensitive information. The database will store the text of contracts and clauses (which is necessary for features like Q&A and for record-keeping). We will encrypt sensitive fields at rest (or even consider storing the raw document in a secure blob store and only keep derived data in the DB). Access controls will ensure only authorized users can view certain contracts (e.g., based on department or role).
•	Scalability: Each contract may have dozens of clauses and flags; the schema can handle that with one-to-many relations. For very large documents (like 100+ page contracts), we might not split every sentence into separate clause records unless needed. We can define “clause” in this context more flexibly (maybe each major section is one record). This is adjustable.
•	Multi-language storage: If we add multilingual support, we might add a field like Language in Contract (to denote the language code, e.g., “en” or “hi”). If we store translated text, we could have additional columns like ClauseTextTranslated or even an associated table for translations. However, an alternative is to handle translation on the fly and not store it permanently, to avoid duplicating large text.
•	Integration hooks: The database is kept largely self-contained for contract data. External integrations (like pushing data to other systems) would be handled by the Node.js service layer. For instance, after a contract is reviewed, the Node.js app could send a notification or update an external CLM. Our schema might include an ExternalID or SyncStatus in Contract if we need to map records to an external system’s IDs.
Implementation Outline
To realize this solution in Node.js, we would structure the application with a modular service architecture:
•	Upload & Parsing Module: Handles receiving a contract file, converting PDF/DOCX to text, splitting into clauses (perhaps using known delimiters or an NLP library), and populating the Contract and Clause tables.
•	AI Analysis Module: Invokes AI services for risk detection, summarization, and comparison. This may involve prompting a large language model (like GPT-4 or a legal-specific model) with each clause (and the playbook guidelines) to get an evaluation. The outputs are then saved: any identified issue becomes a RiskFlag entry, any suggested rewrite is attached as a proposed change (could be a field in RiskFlag or Clause like SuggestedText), and an overall summary is saved in Summary. If using a custom ML model for classification (e.g., to detect clause types or specific issues), that would also feed into these tables. This module ensures all legal risks and red flags are detected by cross-checking the text against multiple sources: the standard clause library, a list of must-have clauses (for missing clause detection), and known risky patterns (for example, “limit of liability: unlimited” is a high risk).
•	Q&A Module: Utilizes a combination of retrieval (to fetch relevant clause texts or definitions from the DB) and a generative model to answer user questions. The Node.js backend will take the user’s question, fetch the contract text or a specific clause if referenced, then construct a prompt for the AI model (which could be an external API). The answer is returned and stored in the QnA table. Over time, a collection of Q&A pairs can also be used to fine-tune the model or to provide instant answers if the same question was asked before (caching responses).
•	Review Interface Module: Generates the review view by querying the database. It will show the contract text (segmented into clauses), with inline highlights or icons for any RiskFlags. It will also show the AI’s comments/suggestions (e.g., “AI suggests adding X clause” or “AI recommends changing this wording”). The lawyer can accept suggestions – which might update the Clause text in the DB and mark the flag as resolved – or add their own input. They can also click “Ask AI” to invoke the Q&A module on a selected clause or the whole contract. When the review is finished, the user marks it complete, and the system updates the HumanReview record and perhaps sets the contract status to “Reviewed”. All these interactions ensure that human approval is required before finalizing the contract.
•	Template Management Module: Allows authorized users to manage the StandardClause library. In the Node.js app, this could be a simple CRUD interface where they can add a new preferred clause text or update an existing one. These templates are used by the analysis module (for comparisons) and could also be pulled into a draft contract if a user wants to start a contract from a template.
•	Compliance Update Module: To maintain Indian legal compliance knowledge, we might have a reference database (outside the scope of our main schema) of legal requirements. However, practically, this can be handled within the AI model’s knowledge and our playbook rules. For example, a playbook rule could be “If contract type is Employment and jurisdiction is India, ensure a clause on Provident Fund and Gratuity is present.” Such rules can either be coded logically or stored in a rules table. In a simpler approach, we encode these in prompt templates for the AI (e.g., “Check if all legally required clauses for an Indian [contract type] are present”).
This Node.js application will operate as a web service with a user-friendly front-end (which could be a web app used by the legal department). The Node backend will interact with the database according to the above design.
By implementing all the features identified in the competitive analysis – from red flag detection and clause summarization to playbook comparisons, chat Q&A, Indian law checks, and human oversight – this solution will enable legal teams to review contracts faster and more consistently. It combines the strengths observed in the market: SpotDraft’s playbook compliance checks, Legistify/LegalBook’s clause generation and risk insights, ContractKen’s Word integration, and Icertis’s enterprise-grade AI, while tailoring the system to Indian legal context and the specific workflow needs of in-house legal departments. The database design ensures that all data (contracts, issues, decisions) is organized and auditable, which is crucial for legal operations.
In summary, this Node.js-based generative AI contract review app will drastically reduce contract review time (by flagging issues in minutes), improve contract quality (by catching risks and missing clauses), and empower legal teams with AI-driven insights – all while keeping the lawyers in control of the final decisions. The structured data stored in the system can further be used for analytics (e.g., reporting how many contracts had a certain risk or how negotiation positions vary), thereby continuously informing and improving the contracting process for the organization.

Folder structure:
The root folder will have the following structure:

contract-ai-backend/ - This folder contains a basic nestjs project for the backend. Check package.json before trying to install a new package.
contract-ai-frontend/ - This folder contains a basic angular project for the frontend. Check package.json before trying to install a new package.
contract-ai-requirements/ - This folder contains the requirement documents


Below is an **addendum** to the original solution document.  
It expands every feature specification and adds a **complete Angular (front-end) workflow** so that an LLM-coding agent can translate the design into working code with minimal ambiguity.

---

## 1. Expanded Functional Specification

| #   | Feature                                | Detailed Behaviour & Acceptance Criteria                                                                                                                                                                                                                                                                                            | Key API Contracts*                                      |
| --- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| 1   | **Contract Upload & Parsing**          | • Accept DOCX, PDF, TXT via drag-and-drop or file-picker.<br>• Detect file type, show progress bar (0 → 100 %).<br>• When upload completes, call `/contracts/import` (multipart).<br>• Show “Parsing…” spinner until backend replies with ContractID.<br>• On success, route to **Review Dashboard** for that ContractID.           | `POST /contracts/import` → `{ contractId }`             |
| 2   | **Clause Segmentation & Display**      | • Fetch `/contracts/:id/clauses`.<br>• Render each clause in collapsible **ClauseCardComponent** (title, body).<br>• High-risk clauses auto-expanded, normal ones collapsed.<br>• Badge colours: Red = High, Amber = Medium, Grey = None.<br>• Clicking badge scrolls to **IssuePanel** (risk details).                             | `GET /contracts/:id/clauses`                            |
| 3   | **Risk Flagging**                      | • IssuePanel lists risks grouped by severity.<br>• Selecting a risk highlights the relevant clause.<br>• “Resolve” button opens **EditDialog** with:<br>   – Full clause text (pre-filled).<br>   – Suggested replacement (if provided).<br>   – Toggle “Accepted/Rejected/Needs Work”.<br>• Saving updates `PATCH /riskFlags/:id`. | `PATCH /riskFlags/:id` body `{ status, newText? }`      |
| 4   | **Playbook Comparison & Auto-Redline** | • When a clause deviates from `StandardClause`, show **DiffView** (side-by-side).<br>• “Auto-Apply” inserts standard text and logs an edit event.<br>• Edits trigger `POST /clauses/:id/replace`.                                                                                                                                   | `POST /clauses/:id/replace` body `{ replacementText }`  |
| 5   | **Executive & Clause-Level Summaries** | • “Summary” tab contains:<br>   – Contract Overview (≈ 250 words).<br>   – Table: clause number → ≤ 30 word blurb.<br>• Refresh button re-requests summaries (idempotent).                                                                                                                                                          | `GET /contracts/:id/summary`                            |
| 6   | **Chat-based Q&A**                     | • Persistent right-dock **ChatAssistantComponent**.<br>• Context automatically includes ContractID, plus selected clause text if user launched chat from a clause.<br>• Streaming tokens displayed as they arrive (SSE / websockets).                                                                                               | `POST /chat` body `{ contractId, clauseId?, question }` |
| 7   | **Indian Compliance Checks**           | • “Compliance” tab shows checklist categories (Data Protection, Labour, Tax, etc.).<br>• Each category row states **Pass / Warn / Fail** with tooltip linking to Indian statute or rule that triggered flag.<br>• Clicking a row filters Risk list to those issues.                                                                 | `GET /contracts/:id/complianceReport`                   |
| 8   | **Human-in-Loop Workflow**             | • Status pill on header: `New → AI Analyzed → In Review → Approved`.<br>• Reviewer actions:<br>   – “Start Review” sets status to **In Review** (`PATCH /contracts/:id` body `{status}`)<br>   – “Approve” prompts confirmation and locks all edits.<br>• Audit log drawer shows every event (`GET /contracts/:id/audit`).          | See endpoints above                                     |
| 9   | **Template (Playbook) Management**     | • Accessible to role `Admin` only.<br>• CRUD screens built with **TemplateEditorComponent** (monaco-editor for rich diffing).<br>• Save calls `PUT /templates/:id` or `POST /templates`.                                                                                                                                            | Standard CRUD                                           |

\*Exact field names may be adapted by backend team; the payloads here give the coding agent concrete starting shapes.

---

## 2. Angular Front-end Workflow

### 2.1 High-Level Architecture

```
📦src
 ┣━app/
 ┃ ┣━core/          ← singleton services & interceptors
 ┃ ┣━shared/        ← reusable UI + pipes + guards
 ┃ ┣━features/
 ┃ ┃ ┣━upload/
 ┃ ┃ ┣━review/      ← major area (dashboard, clause, risk, chat, compliance)
 ┃ ┃ ┗━templates/
 ┃ ┣━app.routes.ts  ← standalone component routing (Angular 17)
 ┗━environments/
```

* **Standalone Components** everywhere – no `NgModule`s (Angular 17 best practice).  
* **Signals & RxJS** for local UI state, **NgRx** for global store (Contracts slice, Auth slice).  
* **Material 3** component library + **Angular CDK** for virtual scrolling and drag-drop.

### 2.2 Routing Table

| Path                       | Component                         | Resolver / Guard                                            |
| -------------------------- | --------------------------------- | ----------------------------------------------------------- |
| `/`                        | `HomePageComponent`               | –                                                           |
| `/upload`                  | `UploadPageComponent`             | AuthGuard                                                   |
| `/contracts/:id`           | `ReviewDashboardComponent`        | `ContractResolver` (fetch contract meta & first 50 clauses) |
| `/contracts/:id/templates` | `TemplateComparisonPageComponent` | RoleGuard(`Reviewer`)                                       |
| `/templates`               | `TemplateAdminPageComponent`      | RoleGuard(`Admin`)                                          |
| `**`                       | `NotFoundComponent`               | –                                                           |

### 2.3 Component Hierarchy for Review Flow

```
ReviewDashboard
 ┣━ ContractHeader (title, status pill, actions)
 ┣━ ClauseList (virtual-scroll list of ClauseCard)
 ┃   ┗━ ClauseCard
 ┃       ┣━ RiskBadge
 ┃       ┗━ ClauseActions (diff, edit, comment)
 ┣━ IssuePanel  (filters, list of RiskItem)
 ┣━ CompliancePanel (accordion checklist)
 ┗━ ChatAssistant (dock / overlay)
```

### 2.4 State Management & Data Flow

1. `ContractResolver` dispatches `loadContract(id)` and `loadClauses(id, page=1)`.  
2. NgRx effects call API via `ApiService`, normalise payloads into entities (`Contract`, `Clause`, `RiskFlag`).  
3. Components subscribe to selectors (`selectCurrentContract`, `selectVisibleClauses`, `selectOpenRisks`).  
4. Mutations (e.g., resolving a flag) dispatch `updateRiskFlag` → effect → API → success → update store.  
5. ChatAssistant keeps its own transient signal state but dispatches `chatAsk` for logging; responses stream over SSE and are patched into store with `chatAppendMessage`.

### 2.5 Services & Utilities

| Service             | Responsibility                                                |
| ------------------- | ------------------------------------------------------------- |
| `ApiService`        | Thin wrapper around `HttpClient` + token interceptor.         |
| `UploadService`     | File validation, chunked upload support, progress tracking.   |
| `ClauseService`     | Local helpers for diff calculation (uses `diff-match-patch`). |
| `AuthService`       | JWT storage, refresh, role checks.                            |
| `ComplianceService` | Maps risk codes to Indian statute references for tooltips.    |

### 2.6 UI/UX Notes

* **Accessibility:** all interactive elements use ARIA roles; keyboard shortcuts (`/` to open chat).  
* **Responsive Layout:** Flexbox grid; ClauseList collapses into accordions on screens < 768 px.  
* **Theming:** Material dark/light themes, organisation colour overrides via CSS variables.  
* **Undo-Redo:** Clause edits cached locally; snackbar offers 10 s “Undo” (dispatches `undoEdit`).  
* **Streaming Chat:** Use `EventSource` (server-sent events) for incremental tokens; fallback to long-polling if SSE unsupported.

---

## 3. Detailed Backend Endpoint Specs (for Front-end Consumption)

| Method & Path                                   | Purpose                     | Req. Body                             | Resp. Body                                                      |
| ----------------------------------------------- | --------------------------- | ------------------------------------- | --------------------------------------------------------------- |
| `POST /contracts/import`                        | Upload raw file             | `multipart/form-data`                 | `{ contractId }`                                                |
| `GET /contracts/:id`                            | Contract meta               | –                                     | `{ id, title, type, status, createdAt, parties, governingLaw }` |
| `GET /contracts/:id/clauses?page=N&pageSize=50` | Paginated clause list       | –                                     | `[ { id, number, heading, text, riskLevel } ]`                  |
| `GET /contracts/:id/summary`                    | Fetch summaries             | –                                     | `{ executive: string, clauses: [ { number, summary } ] }`       |
| `GET /contracts/:id/complianceReport`           | Indian compliance snapshot  | –                                     | `[ { category, status, statute, details } ]`                    |
| `PATCH /riskFlags/:id`                          | Resolve or update a flag    | `{ status: 'accepted'                 | 'rejected'                                                      | 'pending', newText? }` | `{ ok: true }` |
| `POST /clauses/:id/replace`                     | Replace text (auto-redline) | `{ replacementText }`                 | `{ clauseId, oldText, newText }`                                |
| `POST /chat`                                    | Ask contract question       | `{ contractId, clauseId?, question }` | *SSE stream* `{ answerChunk }`                                  |
| `GET /contracts/:id/audit`                      | Full audit history          | –                                     | `[ { timestamp, user, action, details } ]`                      |

*All endpoints secured with **Bearer JWT** in `Authorization` header.*

---

## 4. Pseudocode Snippets for Coding Agent

### 4.1 Angular – Streaming Chat Service

```ts
export function askQuestion(contractId: UUID, q: string, clauseId?: UUID) {
  const url = `/chat`;
  const es = new EventSourcePolyfill(url, {
    headers: { Authorization: `Bearer ${token}` },
    method: 'POST',
    body: JSON.stringify({ contractId, clauseId, question: q })
  });

  signal<string>('answer', '');
  es.onmessage = ev => answer.update(a => a + ev.data);
  es.onerror   = () => es.close();
  return { answer, close: () => es.close() };
}
```

### 4.2 Node.js – AI Risk Detection Worker

```js
async function analyzeClause({ clauseText, type, contractId, clauseId }) {
  const prompt = `
    Evaluate the following clause from a ${type} contract under Indian law.
    1. Identify potential risks or non-standard language.
    2. Suggest a replacement clause if risky.
    3. Rate severity (LOW, MEDIUM, HIGH).
    Clause:
    """${clauseText}"""
  `;

  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    temperature: 0.2,
    messages: [{ role: 'system', content: prompt }]
  });

  const { risks, severity, replacement } = JSON.parse(res.choices[0].message.content);

  await RiskFlag.create({ contractId, clauseId, description: risks, severity, suggestedText: replacement });
}
```

---

## 5. Developer / LLM Coding Agent Checklist

2. **Implement** the file-upload flow exactly as in Feature 1.  
3. **Generate** ClauseCardComponent scaffold, ensure `@Input({ required: true }) clause: ClauseEntity`.  
5. **Create** ApiService endpoints matching Section 3 URLs.  
6. **Ensure** optimistic UI updates for editing a clause or resolving a flag (rollback on 4xx).  
7. **Implement** streaming chat using SSE; fallback to chunked polling for browsers lacking SSE.  
8. **Unit-test** services and facade selectors; Cypress E2E for upload→analysis→resolve→approve happy-path.  
9. **Document** every public interface (TypeScript `@typedef`) so the next agent can auto-generate docs.  
10. **Ensure** all Indian statutory references in CompliancePanel link to an external knowledge base (`legalref.in/statute/:id`).

### 6. Template / Playbook Management – **Deep-Dive**

> Goal: allow legal admins to **codify the organisation’s preferred language and guard-rails** ( “playbook” ).  
> At runtime the AI compares every incoming clause against this playbook and flags deviations or missing clauses.

---

#### 6.1 Conceptual Model

| Term                | Meaning                                                                                                                             |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Template**        | A logical grouping of preferred clauses for a *contract type* (e.g. “Master Services Agreement v3 / India”).                        |
| **Standard Clause** | The canonical text that must (or should) appear in a contract.                                                                      |
| **Rule**            | Metadata that tells the AI **how strictly** to enforce the clause (Must Have, Nice to Have, Forbidden, Deviation Allowed ± % etc.). |
| **Version**         | Immutable snapshot of a template; enables audit and rollback. Only one version can be **Active** at a time.                         |

---

#### 6.2 DB Additions (extend earlier schema)

```text
Template            (templateId PK, name, contractType, jurisdiction, isGlobal, createdBy, createdAt)
TemplateVersion     (versionId PK, templateId FK, versionNo, notes, createdAt, createdBy, isActive)
StandardClause      (clauseId PK, versionId FK, clauseType, title, body, ruleJson, orderIdx)
```

* `ruleJson` example  
  ```json
  {
    "enforcement":"MUST_HAVE",
    "severity":"HIGH",
    "allowedDeviation":5,
    "forbiddenPatterns":["no liability cap","perpetual license"]
  }
  ```

---

#### 6.3 Angular UI Flow

1. `TemplateAdminPageComponent`
   * Route: `/templates`
   * Shows **TemplateTable** with columns: Name, ContractType, Jurisdiction, ActiveVersion, Actions.
   * FAB “New Template”.

2. **Create / Edit Wizard** (4 steps)
   1. **Meta** – name, contractType (select), jurisdiction (multi-select), visibility (global / tenant).
   2. **Clause Library** – list of `ClauseCardEditor` items.  
      *Buttons*: “Add from Word/Markdown”, “Add Blank”.
   3. **Rules** – per clause, open **RuleDialog** to edit JSON-backed form:
      * enforcement level (radio), severity (select), deviation %, regex list.
   4. **Review & Activate** – diff preview if editing an existing template; toggle “Set as Active”.

3. **Version Drawer**
   * Click on template row → side drawer with version history timeline.
   * “Compare” opens `DiffVersionDialog` (monaco diff of two versions).
   * “Rollback” posts `/templates/:id/versions/:vid/activate`.

4. **ClauseCardEditorComponent**
   * Monaco-editor (markdown) left; rendered preview right.
   * Toolbar: **AI-Assist** button → calls `/ai/suggest` with prompt “Draft a standard ‘Confidentiality’ clause for India SaaS”.

---

#### 6.4 API Surface

| Method   | Path                                    | Description                                                                       |
| -------- | --------------------------------------- | --------------------------------------------------------------------------------- |
| `POST`   | `/templates`                            | Create template + v1 + clauses                                                    |
| `GET`    | `/templates?contractType=MSA`           | Paginated list                                                                    |
| `GET`    | `/templates/:id`                        | Template meta + active version                                                    |
| `POST`   | `/templates/:id/versions`               | Create **new version** (body: `{ baseVersionId, updatedMeta, updatedClauses[] }`) |
| `GET`    | `/templates/:id/versions/:vid`          | Single version payload                                                            |
| `POST`   | `/templates/:id/versions/:vid/activate` | Marks version **Active**                                                          |
| `DELETE` | `/templates/:id`                        | Soft delete (keeps history)                                                       |

All clause bodies transmitted/received as **Markdown** to preserve formatting; backend converts to raw text for NLP comparison.

---

#### 6.5 Runtime Comparison Algorithm (simplified)

```ts
for (const clause of incomingContract.clauses) {
  const playbook = findPlaybook(clause.type, contractType, jurisdiction);
  if (!playbook) continue;          // no rule

  const similarity = jaccard(clause.text, playbook.body);
  if (similarity < 1 - playbook.rule.allowedDeviation/100) {
      createRiskFlag({
        contractId, clauseId: clause.id,
        description: `Deviation from standard ${clause.type}`,
        severity: playbook.rule.severity,
        suggestedText: playbook.body
      });
  }

  for (const pattern of playbook.rule.forbiddenPatterns) {
     if (clause.text.toLowerCase().includes(pattern)) { ... flag ... }
  }
}

/* Missing-clause check */
for (const required of template.clauses.filter(c=>c.rule.enforcement==='MUST_HAVE')) {
  if (!contract.hasClauseType(required.clauseType)) {
       createRiskFlag({ description: `${required.clauseType} missing`, ... });
  }
}
```

---

#### 6.6 End-to-End Usage Scenario

1. **Admin** imports corporate MSA template; wizard auto-splits headings → clauses; sets enforcement.  
2. **Version 1** is activated.  
3. **Reviewer** uploads a vendor-drafted MSA.  
4. AI compares each clause to v1, generating RiskFlags:
   * “Limitation of Liability deviates 12 % from standard (allowed 5 %).”
   * “No audit rights clause – required (High).”
5. Reviewer presses **Diff** to view side-by-side and clicks **Auto-Apply** for audit clause.  
6. Deal closes. Later, legislation changes PF wording → Admin creates **Version 2**, edits only that clause, marks **Active**.  
7. All *new* analyses use v2; historical contracts still reference their original version for audit purity.

---

#### 6.7 Developer Checklist (Template Module)

- [ ] Entities & NgRx slice: `Template`, `TemplateVersion`, `StandardClause`.  
- [ ] Wizard with step-per-route pattern (`angular-stepper` or custom).  
- [ ] Monaco diff integration (`monaco-editor` + `ngx-monaco-editor`).  
- [ ] JSON-schema-driven RuleDialog (zod / @angular/forms).  
- [ ] SSE queue to show “AI-Assist drafting…” progress in ClauseCardEditor.  
- [ ] Unit tests: rule enforcement edge-cases, version activation flow.  
- [ ] E2E (Cypress): create template → upload contract → auto-flag missing clause → rollback version.

This expanded section gives the coding agent **schema, UI, API, workflow, and algorithmic logic** required to implement robust Template / Playbook management end-to-end.

Tech Stack:

Backend:
- NestJS
- PostgreSQL
- TypeORM
- LangChainJS
- Gemini API
- OpenAI API
- PNPM package manager

Frontend:
- Angular 19
- TailwindCSS
- PNPM package manager
- Make sure it is modular

Use Browser MCP to test your changes and make sure to run any npm command using pnpm only.
Assume 'pnpm start is already running so don't try to run it again.

Important:
1. Always use Browser MCP to test the changes implemented in frontend
2. Angular Template code goes in separate HTML files
3. Follow Micro Frontend pattern everywhere
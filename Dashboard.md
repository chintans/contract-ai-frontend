## Dashboard Requirements – Comprehensive Implementation Blueprint

*(No code; precise functional, UX, and API guidelines for a coding agent)*

---

### 1  Purpose & Scope

The **Dashboard** is the **single work surface** where reviewers upload, analyse, remediate, and approve contracts.
It must:

1. Surface **all AI insights** (risks, compliance, summaries) at a glance.
2. Provide **deep-dive navigation** to clauses, playbook diffs, chat, and audit logs.
3. Track **review progress** with real-time status indicators.
4. Enable **bulk actions** (filter, resolve, export) without leaving the page.

---

### 2  User Roles & Permissions

| Role          | Dashboard Capabilities                                               |
| ------------- | -------------------------------------------------------------------- |
| **Reviewer**  | Full read/write on risk flags, clause edits, chat, approval.         |
| **Observer**  | Read-only view; cannot edit or approve.                              |
| **Admin**     | All Reviewer rights + template/playbook buttons visible.             |
| **AI Worker** | Web-socket / SSE client; pushes analysis updates but cannot view UI. |

Front-end must hide or disable controls dynamically based on JWT claims; back-end must **enforce** via RBAC middleware.

---

### 3  Visual Layout & UX Specification

```
┌──────────────────────────────── Dashboard Header ──────────────────────────┐
│  Breadcrumbs   |  Contract Title  |  Status Pill  |  Progress Bar (steps) │
│  Parties & Meta (pop-over)        |  Action Menu: Start Review / Approve  │
└────────────────────────────────────────────────────────────────────────────┘

┌─Left Rail───────────────────┐  ┌─Main Panel (Tabbed)─────────────────────┐
│ ▸ Risk List (filterable)    │  │ Tab 1  Clauses        [List/Grid]       │
│ ▸ Compliance Checklist      │  │ Tab 2  Summaries                         │
│ ▸ Event Timeline (audit)    │  │ Tab 3  Compliance Report                 │
│ ▸ Search Box                │  │ Tab 4  Attachments / Versions           │
└──────────────────────────────┘  └──────────────────────────────────────────┘

               ⧉ Dockable Chat Assistant (slide-over right)
```

**Interaction Highlights**

* Selecting a risk in the left rail **scrolls & flashes** the associated clause in Tab 1.
* Status Pill cycles: **New → AI Analysed → In Review → Approved**.
* Progress Bar segments: Upload (✓) → AI Analysis (✓/in-progress) → Human Review (%) → Approval.
* Dockable Chat persists across tabs; users can minimise to a pill.

Accessibility: ensure entire layout is operable via keyboard; ARIA landmarks for main regions.

---

### 4  Front-End Functional Requirements

| #   | Feature                     | Front-End Behaviour                                                                                                                                                                               |
| --- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Real-time Risk Counter**  | Badge in left rail shows Live counts: `High (3) • Medium (5) • Low (7)`. Increment or decrement as AI finishes or reviewer resolves.                                                              |
| 2   | **Advanced Filtering**      | Multi-select chips: Severity, Clause Type, Rule Category, Reviewer, Resolved/Unresolved. Search string filters clause body live (debounced). Filters persist in URL `queryParams` for deep-links. |
| 3   | **Infinite/Virtual Scroll** | Clauses list must virtualise >1 000 clauses without jank; scroll position preserved when user hops tabs.                                                                                          |
| 4   | **Bulk Resolve**            | When multiple risks are selected, toolbar appears with Resolve/Change-Severity/Delete. Confirmation modal summarises actions.                                                                     |
| 5   | **Autosave Draft Edits**    | Clause edits are cached in local store on blur; unsaved count displayed; global “Save All” and “Discard All” buttons with diff summary.                                                           |
| 6   | **Comparison Drawer**       | On “Diff” click, slide-up drawer shows playbook text vs current clause, with a *toggle* for inline/side-by-side.                                                                                  |
| 7   | **Compliance Heat-map**     | Compliance tab renders a tile grid (category × rule) colour-coded Pass/Warn/Fail; clicking a tile jumps to associated risk.                                                                       |
| 8   | **Export Report**           | Action Menu → “Export PDF / DOCX” triggers generation of consolidated report (summary, flags, compliance) and opens download dialog when ready.                                                   |
| 9   | **Offline Guardrails**      | If network offline: toast alert, risk badges grey-out, all mutating controls disabled; edits stored in IndexedDB queue for sync.                                                                  |
| 10  | **Responsive Design**       | Breakpoints: ≥ 1280 px (dual-panel), 768–1279 px (left rail collapsible), < 768 px (tabbed nav; Chat toggles full-screen modal).                                                                  |

State Management: use **NgRx** slices `contracts`, `clauses`, `riskFlags`, `compliance`, `chat`, `uploadQueue`. Side effects via Effects; memoised selectors for heavy joins.

---

### 5  Back-End Service Requirements

| Domain Service        | Responsibilities                                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **ContractService**   | CRUD contracts; emit SSE events (`analysisProgress`, `riskCreated`, `riskUpdated`, `reviewStatusChanged`).               |
| **ClauseService**     | Paginated clause retrieval, edit revisioning, diff generation, full-text search endpoint for front-end filters.          |
| **RiskService**       | Generate, update, bulk resolve flags; ensure idempotency and optimistic locking (`etag` header).                         |
| **ComplianceService** | Compile compliance checklist per template version; compute heat-map matrix and per-category status.                      |
| **ReportService**     | Asynchronous PDF/DOCX generation job queue; expose `GET /reports/:id/status` + download.                                 |
| **AuditService**      | Append immutable journal entries for every mutation; deliver timeline feed with server-side paging and actor enrichment. |

**API Contracts (high-level)**

* **SSE channel** `/contracts/:id/events` – unified stream; event types enumerated in OpenAPI (analysisProgress, riskFlag, clauseUpdate, statusChange).
* **Pagination defaults**: `pageSize=50` for clauses, `cursor` pagination for timeline.
* **Security**: Bearer JWT with `scope` claims; per-contract ACL check before every response.
* **Rate Limits**: Uploads = 20 files/hr/user; API = 200 req/min/user; SSE limited to 1 per tab via token.
* **Error Model**: JSON: `{ code, message, detail?, traceId }`. 409 for ETag mismatch, 403 for ACL, 422 for semantic validation.
* **Data Shape Guarantees**: risk counts in SSE always include full object payload so UI can update store without extra fetch.

---

### 6  System Interactions & Sequence

```
User uploads file → UploadService stores blob + Contract row (status=NEW)  
                   → Worker triggers AI analysis → SSE: analysisProgress  
                   → For each flagged risk → SSE: riskCreated  
Front-end receives SSE, updates NgRx; Risk Badges tick up in real-time  
User resolves risk → PATCH /riskFlags/:id → SSE echo riskUpdated  
User edits clause → PUT /clauses/:id → SSE clauseUpdate  
When all HIGH/ MEDIUM resolved → user clicks Approve → PATCH /contracts/:id  
                   → SSE statusChange (APPROVED) → PDF report auto-generated
```

---

### 7  Non-Functional Requirements

* **Performance**: Initial dashboard load ≤ 2 s for contracts ≤ 150 clauses.
* **Scalability**: Endpoints stateless; Redis pub/sub for SSE fan-out; Postgres partitioning on `contractId`.
* **Resilience**: SSE reconnects with exponential back-off; unsaved edits synced after reconnect.
* **Observability**: Each API call logs `traceId`; Kibana dashboards for latency & error rates; SLO 99.5 % uptime for dashboard endpoints.
* **Accessibility**: WCAG 2.1 AA; colour palette passes contrast; all dynamic updates announce via ARIA live regions.
* **I18n**: UI text externalised; date & number formats locale-aware; clause texts remain original language.

---

### 8  Developer Checklist (Front-End)

1. Scaffold page layout using Angular *stand-alone* components and CSS grid/flex.
2. Connect NgRx store with lazy-loaded Feature modules.
3. Implement SSE service with auto-reconnect and store updaters.
4. Build FilterBar with chips + keyword search bound to memoised selector.
5. Implement virtual scroll list integrated with clauses API paging.
6. Ensure each interaction writes Audit entry via dedicated effect.
7. Validate upload size, type, network errors; show retry queue.
8. Create Cypress scripts: “AI complete → reviewer resolves all → export report”.

### 9  Developer Checklist (Back-End)

1. Define OpenAPI spec first; include SSE schema.
2. Implement contract-level RBAC middleware; factor ACL into every `where` clause.
3. Use Postgres row-level security or view-based filtering if multi-tenant.
4. Guarantee exactly-once Risk flag creation via DB unique UID + UPSERT.
5. Push all events through Redis channel; SSE controller multiplexes by contractId.
6. Enqueue heavy PDF generation in worker pool; job status table with exponential retry.
7. Emit structured logs (JSON) with `traceId`; integrate with central log aggregator.
8. Stress-test: simulate 1 000 concurrent users, 100 AI analyses/min, ensure SSE latency < 2 s P95.

---

By adhering to these **detailed Dashboard requirements** the AI coding agent can build an experience that is **responsive, real-time, auditable, and legally robust**—without the ambiguity of hidden logic or unspecified behaviours.

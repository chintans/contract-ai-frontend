**Detailing contract rules**

The 'Rules' in a contract template include various attributes. For example, **enforcement types** (MUST\_HAVE, SHOULD\_HAVE, etc.), **severity levels** (HIGH, MEDIUM, LOW), and **allowedDeviation** (a threshold for redline detection). We also include **forbidden patterns** (regex or phrases to flag language), **reference statutes**, and **conditional rules** (depending on clauses). These rules influence **risk flag creation**, **severity scoring**, and **suggested text**. **Fallback languages**, **auto-suggestions**, and **risk scoring** also play roles in ensuring compliance and improving template quality.


Thought for 7 seconds


### 6.3-bis **Rules** in Template / Playbook Management

*(Purpose, data model, run-time logic, and implementation guidelines for an AI coding agent)*

---

#### A. What “Rules” Are

A **Rule** is structured metadata attached to each *StandardClause* that tells the system **how to measure conformity** and **what to do** if a contract clause deviates.
Think of Rules as *policy knobs* that translate legal team preferences into deterministic machine checks. They drive 👇

1. **Risk-Flag generation** (what is raised, its severity, and wording).
2. **Compliance tab scoring** (Pass / Warn / Fail).
3. **Auto-suggest behaviour** (offer replacement text, block-list text, or leave informational).
4. **Overall contract risk score** (aggregated across Rules).

---

#### B. Canonical Rule Schema

```jsonc
{
  "enforcement": "MUST_HAVE",        // enum: MUST_HAVE | SHOULD_HAVE | MUST_NOT_HAVE | OPTIONAL
  "severity": "HIGH",                // enum: HIGH | MEDIUM | LOW
  "similarityThreshold": 95,         // % text similarity required (0-100). null = ignore
  "deviationAllowedPct": 5,          // tolerated delta vs threshold (overrides similarityThreshold)
  "forbiddenPatterns": [             // regex OR plain strings (case-insensitive)
    "perpetual license",
    "(?i)unlimited liability"
  ],
  "requiredPatterns": [              // text/regex that *must* appear (for content checks)
    "Indian Contract Act 1872"
  ],
  "statutoryReference": "IT Act §43-A", // optional: links risk to a statute for tooltips
  "autoSuggest": true,               // if true → show StandardClause body as replacement option
  "scoreWeight": 2.5,                // impact on composite contract risk score
  "condition": {                     // OPTIONAL dynamic rule
    "if": { "contractType": "MSA", "jurisdiction": "India" },
    "unless": { "dealValueLakh": "< 5" }
  }
}
```

> • **enforcement** sets baseline logic.<br>• **similarityThreshold** & **deviationAllowedPct** are *either-or*; use the first present.<br>• **condition** allows context-aware rules (e.g., cap indemnity only for large deals).

---

#### C. How Rules Impact the System

| System Area            | Effect of Rule                                                                                                                                                                                                 |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **AI Analysis Worker** | • computes similarity (Jaccard / cosine) between incoming clause and StandardClause.<br>• scans `forbiddenPatterns` and `requiredPatterns`.<br>• decides *flag type* (Missing / Deviation / Forbidden / Info). |
| **RiskFlag Record**    | Populated with `severity`, descriptive message, `suggestedText` (if `autoSuggest`).                                                                                                                            |
| **Compliance Report**  | Groups flags by `statutoryReference`; PASS if no HIGH rule fails.                                                                                                                                              |
| **Chat Assistant**     | When user asks “Why is this flagged?”, the answer template references the Rule metadata (“Because enforcement=MUST\_NOT\_HAVE and pattern ‘unlimited liability’ found”).                                       |
| **Overall Score**      | Contract risk score = Σ (rule.scoreWeight × ruleSeverityNumeric).                                                                                                                                              |

---

#### D. Implementation Blueprint for Coding Agent

1. **TypeScript / Java: Authoritative Interfaces**

```ts
export enum Enforcement { MUST_HAVE, SHOULD_HAVE, MUST_NOT_HAVE, OPTIONAL }
export enum Severity { HIGH = 3, MEDIUM = 2, LOW = 1 }

export interface ClauseRule {
  enforcement: Enforcement;
  severity: Severity;
  similarityThreshold?: number;      // 0-100
  deviationAllowedPct?: number;      // 0-100
  forbiddenPatterns?: string[];
  requiredPatterns?: string[];
  statutoryReference?: string;
  autoSuggest?: boolean;
  scoreWeight?: number;              // default 1
  condition?: RuleCondition;
}

export interface RuleCondition {
  if?: Record<string, string>;
  unless?: Record<string, string|number>;
}
```

2. **Validation Layer**

   * Use a JSON-schema or Zod definition so the UI wizard rejects invalid combinations (e.g., both similarityThreshold and deviationAllowedPct = null ⇒ invalid; forbiddenPatterns only makes sense for MUST\_NOT\_HAVE or SHOULD\_HAVE).
   * The wizard’s **RuleDialog** auto-maps enum values to radio buttons; regex inputs are validated with `new RegExp()` inside a try-catch.

3. **Persistence & Versioning**

   * The `ruleJson` column stores a *stringified, immutable* snapshot.
   * Any edit via Template Wizard -> create a *new* TemplateVersion row; never mutate old JSON (audit trail).

4. **Run-time Evaluation Engine**

```js
function evaluateRule(clauseText, rule, standardBody) {
  // Step 1: Evaluate conditional guard
  if (!conditionPasses(rule.condition, contractMeta)) return null;

  // Step 2: Presence / absence checks
  if (rule.enforcement === 'MUST_HAVE' && !clauseText) { /* missing */ }
  if (rule.enforcement === 'MUST_NOT_HAVE' && clauseText) { /* illegal presence */ }

  // Step 3: Similarity / deviation
  if (clauseText && standardBody && rule.similarityThreshold) {
     const sim = similarity(clauseText, standardBody);
     if (sim < rule.similarityThreshold - (rule.deviationAllowedPct||0)) { /* deviation flag */ }
  }

  // Step 4: Pattern checks
  for (p of rule.forbiddenPatterns||[]) if (new RegExp(p,'i').test(clauseText)) { /* forbidden */ }
  for (p of rule.requiredPatterns||[])  if (!new RegExp(p,'i').test(clauseText)) { /* missing req pattern */ }

  // Step 5: Produce RiskFlag object
  return {
    severity: rule.severity,
    type: ...,
    description: ...,
    suggestedText: rule.autoSuggest ? standardBody : null,
    statutoryReference: rule.statutoryReference
  };
}
```

5. **Performance Notes**

   * Pre-compile forbidden/required regexes per template version into an in-memory map.
   * Use cosine similarity on *minhash shingles* (fast) for large templates.

6. **Unit-Test Matrix**

| Test Case                            | Expected Result                          |
| ------------------------------------ | ---------------------------------------- |
| MUST\_HAVE clause missing            | RiskFlag type=Missing, severity per rule |
| MUST\_NOT\_HAVE pattern present      | RiskFlag type=Forbidden, severity        |
| Deviation > allowedPct               | RiskFlag type=Deviation                  |
| Required pattern absent              | RiskFlag type=MissingPattern             |
| Condition `unless dealValueLakh < 5` | No flag when dealValue=3 lakh            |

Include fixtures for Hindi-language clauses to ensure multilingual text normalisation before similarity check.

7. **Front-end Wizard Hints**

   * Real-time preview: as user edits rule, show *simulation* against the StandardClause (“This rule would flag the uploaded clause with severity HIGH”).
   * Tooltip over `similarityThreshold` explaining: *“Exact text match = 100 %. Lower this if you permit paraphrasing.”*

8. **Documentation Stub (OpenAPI excerpt)**

```yaml
StandardClause:
  type: object
  properties:
    clauseId: { type: string, format: uuid }
    clauseType: { type: string }
    title: { type: string }
    body: { type: string }
    rule: { $ref: '#/components/schemas/ClauseRule' }
```

9. **Migration Strategy**

   * For legacy templates without rules, default to `{ enforcement:'OPTIONAL', severity:'LOW' }` and mark `needsUpgrade = true` so admins can enrich over time.

---

##### With these expanded rule requirements and implementation notes, an LLM-driven coding agent now has **unambiguous guidance** to:

* render intuitive rule-editing UI,
* persist validated JSON,
* execute deterministic checks,
* and surface meaningful, statute-linked risk flags to reviewers.

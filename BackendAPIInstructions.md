# Backend API Instructions

This project uses an Angular frontend that expects a NestJS backend running at `http://localhost:3000/api`. The backend should expose REST endpoints that match the services and models found in the frontend source.

## General Conventions
- Base path: `/api`.
- Use NestJS with `@nestjs/swagger` for API documentation.
- Enable global validation with `class-validator` and `ValidationPipe`.
- All DTO properties should be typed and validated. Mirror the frontend models located under `src/app/features` and `src/app/services`.

## Standard Clauses
Frontend service: `src/app/features/standard-clauses/services/standard-clause.service.ts`.
Interface definition: `src/app/features/standard-clauses/models/standard-clause.model.ts`.
Key fields are:
```ts
id: number;
name: string;
type: string;
text: string;
jurisdiction: string;
allowedDeviations: number;
contractType: string;
version: string;
createdAt: Date;
updatedAt: Date;
```

### Endpoints
| Method & Path | Description |
|---|---|
| `GET /standard-clauses` | List all clauses |
| `GET /standard-clauses/:id` | Retrieve a clause by ID |
| `GET /standard-clauses/type/:type` | Filter by `type` |
| `GET /standard-clauses/contract-type/:contractType` | Filter by contract type |
| `POST /standard-clauses` | Create a clause |
| `PATCH /standard-clauses/:id` | Update a clause |
| `DELETE /standard-clauses/:id` | Remove a clause |

### Validation
Create `CreateStandardClauseDto` and `UpdateStandardClauseDto` classes mirroring the interface above. Use decorators such as `@IsString()`, `@IsNumber()`, `@IsOptional()`, and `@Max()` to enforce:
- `allowedDeviations` between 0 and 100.
- `name`, `type`, `text`, `jurisdiction` and `contractType` are required on creation.

The frontend performs rule validation client side (see `rule-validation.service.ts`), so replicate similar logic server side when persisting rules for a clause.

## Template Library
The generic template service (`src/app/services/templates.service.ts`) uses the following interface:
```ts
id: string;
name: string;
type: string;
content: string;
jurisdiction?: string;
version?: string;
description?: string;
metadata?: Record<string, any>;
isActive: boolean;
createdAt: Date;
updatedAt: Date;
```

### Endpoints
| Method & Path | Description |
|---|---|
| `GET /templates` | List templates |
| `GET /templates/:id` | Get single template |
| `GET /templates/type/:type` | Filter templates by type |
| `GET /templates/jurisdiction/:jurisdiction` | Filter by jurisdiction |
| `POST /templates` | Create template |
| `PATCH /templates/:id` | Update template |
| `DELETE /templates/:id` | Delete template |

### Validation
- Require `name`, `type` and `content` on creation.
- `isActive` defaults to `true`.
- Validate optional fields (`jurisdiction`, `version`, `description`) with `@IsOptional()`.

## Contract Review
The contract review feature uploads a contract file and receives AI analysis results (see `contract-analysis.service.ts`). Implement these endpoints:

| Method & Path | Description |
|---|---|
| `POST /contracts` | `multipart/form-data` upload with fields `contractType` and `file` (PDF/DOCX). Returns the created contract ID. |
| `GET /contracts/:id` | Basic contract metadata. |
| `GET /contracts/:id/analysis` | Full analysis result: summary and risk flags. |
| `PATCH /contracts/:id/risk-flags/:riskId` | Update status or notes for a specific risk flag. |
| `POST /contracts/:id/chat` | Submit a question; returns AI answer and stores it. |
| `GET /contracts/:id/chat` | Retrieve previous chat messages. |
| `GET /contracts/:id/export` | Download JSON export of the analysis. |

### Schemas
Use models similar to those in `src/app/features/dashboard/store/dashboard.models.ts` for contracts, clauses, risk flags, compliance statuses and chat messages.
Important fields include `Contract.id`, `Clause.id`, `RiskFlag.status`, etc.

### Validation
- Uploaded files must be validated for size and type.
- When updating risk flags, validate status as `'open'`, `'resolved'`, or `'ignored'`.
- For chat questions, require a non-empty `question` string.

## Rules Management
Rules are defined in `src/app/features/standard-clauses/models/rule.model.ts`. Provide endpoints so the frontend can store and manage them server side.

| Method & Path | Description |
|---|---|
| `GET /rules` | List rules |
| `GET /rules/:id` | Get rule by ID |
| `POST /rules` | Create rule |
| `PATCH /rules/:id` | Update rule |
| `DELETE /rules/:id` | Delete rule |

Validation should mirror `RuleValidationService` logic. Ensure numeric fields are within range, regex patterns are valid and that `similarityThreshold` and `deviationAllowedPct` are not both set.

## Response Format
Return JSON with a consistent envelope, for example:
```json
{
  "data": { /* payload */ },
  "errors": [],
  "message": "optional human readable message"
}
```
Use appropriate HTTP status codes (201 for creation, 400 for validation errors, etc.).

## Security Notes
- Implement authentication and authorization (e.g., JWT) but allow anonymous access during early development.
- Sanitize all user input.
- Store uploaded files securely and scan them before processing.


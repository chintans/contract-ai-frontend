# Agent Instructions for `contract-ai-frontend`

This repository contains the Angular 19 front-end for a generative AI contract review application. Follow these conventions when making changes.

## Tooling
- **Use `pnpm` for all Node/Angular commands.** Do not use `npm` or `yarn`.
- `pnpm start` is assumed to be running. Do **not** attempt to run it again.
- Run programmatic checks after changes:
  - Unit tests: `pnpm run test`
  - E2E tests: `pnpm run e2e`
- Test UI interactions in **Browser MCP**.

## Angular Style Guidelines
- Keep HTML templates in their own `.component.html` file and component-specific styles in their own `.scss` file【F:.cursor/rules/angular-rules.mdc†L26-L27】.
- Use the micro frontend pattern and create many small reusable components【F:.cursor/rules/angular-rules.mdc†L8-L15】.
- File names use kebab-case with suffixes like `.component.ts`, `.service.ts`, `.component.html`, etc.【F:.cursor/rules/angular-rules.mdc†L29-L38】.
- Use single quotes, 2-space indentation, and avoid trailing whitespace【F:.cursor/rules/angular-rules.mdc†L40-L45】.
- Prefer named exports and define data structures with interfaces. Avoid `any` and leverage the type system fully【F:.cursor/rules/angular-rules.mdc†L15-L25】.
- Use Angular’s signals and the `inject` function to manage state and dependencies efficiently【F:.cursor/rules/angular-rules.mdc†L23-L25】【F:.cursor/rules/angular-rules.mdc†L52-L53】.
- Order imports: Angular core, RxJS, other Angular modules, application core, shared modules, environment, relative paths【F:.cursor/rules/angular-rules.mdc†L55-L62】.
- Follow the Arrange-Act-Assert pattern for tests【F:.cursor/rules/angular-rules.mdc†L69-L70】.

## Project Architecture
```
📦src
 ┣━app/
 ┃ ┣━core/          ← singleton services & interceptors
 ┃ ┣━shared/        ← reusable UI + pipes + guards
 ┃ ┣━features/
 ┃ ┃ ┣━upload/
 ┃ ┃ ┣━review/      ← dashboard, clause, risk, chat, compliance
 ┃ ┃ ┗━templates/
 ┃ ┣━app.routes.ts  ← standalone component routing
 ┗━environments/
```
【F:Requirement.md†L74-L92】
- Use **standalone components**; do not create `NgModule`s【F:Requirement.md†L94-L94】.
- Manage local state with **signals & RxJS** and global state with **NgRx**【F:Requirement.md†L95-L95】.
- Use Material 3 and Angular CDK for UI, plus TailwindCSS for styling【F:Requirement.md†L96-L98】【F:Requirement.md†L376-L379】.

## Additional Requirements
- Ensure the project remains modular and follows the micro frontend pattern【F:Requirement.md†L380-L388】.
- Always use Browser MCP to test front-end changes and run any `pnpm` commands only with `pnpm`【F:Requirement.md†L382-L387】.


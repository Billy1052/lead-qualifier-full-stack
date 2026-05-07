# Workflows

This folder contains all trigger.dev background jobs and the AI prompts they use.

## Structure

```
Workflows/
├── lead-qualifier.job.ts   ← Main qualification job
└── prompts/
    └── qualify-lead.md    ← System prompt for Claude
```

## How to add a new job

1. Create a new file named `<job-name>.job.ts` in this folder.
2. Define and export a trigger.dev `task` — see `lead-qualifier.job.ts` as a reference.
3. If the job uses Claude, add a matching prompt file in `prompts/`.
4. Run `npx trigger.dev@latest dev` to test it locally.
5. Run `npx trigger.dev@latest deploy` to push it to trigger.dev cloud.

## Prompt files

Prompts live in `prompts/*.md` and are loaded as strings at runtime. Keeping them in separate files makes them easy to iterate on without touching job logic.

## Deploying

```bash
# From the project root
npx trigger.dev@latest deploy
```

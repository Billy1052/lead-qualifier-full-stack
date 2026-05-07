# Tools

This folder contains shared utilities and developer scripts used by the workflow.

## Structure

```
Tools/
├── lib/
│   └── trigger-client.ts   ← Shared trigger.dev client configuration
└── scripts/
    └── test-workflow.ts    ← Run the lead qualifier job locally (no UI needed)
```

## lib/

Shared code imported by jobs in `Workflows/` and by the Next.js API routes. Add new shared utilities here — API clients, type definitions, validators, etc.

## scripts/

One-off developer scripts. To test the lead qualifier job without opening the browser:

```bash
cd Tools
npx tsx scripts/test-workflow.ts
```

You can edit the sample payload at the top of `test-workflow.ts` to test different lead scenarios.

import { tasks, auth } from "@trigger.dev/sdk/v3";
import { NextResponse } from "next/server";
import type { LeadPayload } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const payload: LeadPayload = await req.json();

    const handle = await tasks.trigger("lead-qualifier", payload);

    const publicToken = await auth.createPublicToken({
      scopes: { read: { runs: [handle.id] } },
    });

    return NextResponse.json({ runId: handle.id, publicToken });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[/api/analyze]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

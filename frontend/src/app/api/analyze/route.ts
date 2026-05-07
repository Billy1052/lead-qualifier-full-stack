import { tasks, auth } from "@trigger.dev/sdk/v3";
import { NextResponse } from "next/server";
import type { LeadPayload } from "@/lib/types";

export async function POST(req: Request) {
  const payload: LeadPayload = await req.json();

  const handle = await tasks.trigger("lead-qualifier", payload);

  // Create a short-lived public token so the browser can subscribe to this run only
  const publicToken = await auth.createPublicToken({
    scopes: { read: { runs: [handle.id] } },
  });

  return NextResponse.json({ runId: handle.id, publicToken });
}

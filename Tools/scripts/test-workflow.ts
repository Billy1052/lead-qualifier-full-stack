import { tasks } from "@trigger.dev/sdk/v3";
import * as dotenv from "dotenv";
import type { LeadPayload, QualificationResult } from "../lib/types.js";

dotenv.config();

// Edit this payload to test different lead scenarios
const testPayload: LeadPayload = {
  companyName: "Acme SaaS Co.",
  companySize: "11-50",
  industry: "SaaS",
  budgetRange: "$5k-$20k",
  painPoints:
    "Our sales team spends 3+ hours a day manually researching and scoring inbound leads. We need to automate qualification so reps can focus on closing.",
};

async function main() {
  console.log("Triggering lead-qualifier job...\n");
  console.log("Payload:", JSON.stringify(testPayload, null, 2), "\n");

  const result = await tasks.triggerAndPoll<() => Promise<QualificationResult>>(
    "lead-qualifier",
    testPayload,
    { pollIntervalMs: 1500 }
  );

  console.log("Qualification Result:");
  console.log(JSON.stringify(result.output, null, 2));
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});

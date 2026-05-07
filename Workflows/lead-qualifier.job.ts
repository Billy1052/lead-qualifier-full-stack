import { task } from "@trigger.dev/sdk/v3";
import Anthropic from "@anthropic-ai/sdk";
import type { LeadPayload, QualificationResult } from "../Tools/lib/types.js";

const anthropic = new Anthropic();

// The canonical version of this prompt lives in Workflows/prompts/qualify-lead.md
// Keep both in sync when making changes.
const SYSTEM_PROMPT = `You are an expert B2B sales consultant and lead qualifier. Your job is to analyze incoming prospect information and determine their quality and fit as a potential customer.

Scoring criteria:
- Pain point clarity (30%): How specific, urgent, and well-defined is the problem? Vague pain = long sales cycle.
- Budget fit (30%): Does their budget match the scope of solving this problem?
- Company size fit (20%): Is the company at a stage where this solution adds real value?
- Industry fit (20%): Is this a strong-fit industry or a stretch?

Tier definitions:
- Hot (score 8-10): Strong fit across most dimensions. Prioritize immediately.
- Warm (score 5-7): Potential exists but gaps need to be explored. Nurture actively.
- Cold (score 1-4): Poor fit or too early. Low-effort follow-up only.

You MUST respond with ONLY a valid JSON object — no markdown, no explanation, just raw JSON:
{
  "score": <integer 1-10>,
  "tier": "<Hot|Warm|Cold>",
  "summary": "<2-3 sentence executive summary of this lead>",
  "strengths": ["<specific strength>", "..."],
  "concerns": ["<specific concern or red flag>", "..."],
  "recommendedAction": "<one specific next step>"
}

Reference the specific details provided. Avoid generic observations. Be direct and decisive.`;

function formatLeadMessage(payload: LeadPayload): string {
  return `Company Name: ${payload.companyName}
Company Size: ${payload.companySize} employees
Industry: ${payload.industry}
Budget Range: ${payload.budgetRange}
Pain Points / Notes: ${payload.painPoints}`;
}

export const leadQualifierTask = task({
  id: "lead-qualifier",
  maxDuration: 60,
  run: async (payload: LeadPayload): Promise<QualificationResult> => {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: formatLeadMessage(payload) }],
    });

    const block = response.content[0];
    if (block.type !== "text") {
      throw new Error(`Unexpected Claude response type: ${block.type}`);
    }

    // Claude sometimes wraps JSON in markdown code fences — strip them before parsing
    const cleaned = block.text
      .trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "");

    let result: QualificationResult;
    try {
      result = JSON.parse(cleaned);
    } catch {
      throw new Error(`Claude returned invalid JSON: ${cleaned}`);
    }

    return result;
  },
});

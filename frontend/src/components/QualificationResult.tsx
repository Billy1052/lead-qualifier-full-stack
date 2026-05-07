"use client";

import type { QualificationResult } from "@/lib/types";

interface Props {
  result: QualificationResult;
}

const TIER_STYLES: Record<QualificationResult["tier"], string> = {
  Hot: "bg-red-100 text-red-700 border-red-200",
  Warm: "bg-amber-100 text-amber-700 border-amber-200",
  Cold: "bg-blue-100 text-blue-700 border-blue-200",
};

const SCORE_COLOR = (score: number) => {
  if (score >= 8) return "text-red-600";
  if (score >= 5) return "text-amber-600";
  return "text-blue-600";
};

export default function QualificationResult({ result }: Props) {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${TIER_STYLES[result.tier]}`}
          >
            {result.tier} Lead
          </span>
        </div>
        <div className="text-right">
          <span className={`text-4xl font-bold ${SCORE_COLOR(result.score)}`}>
            {result.score}
          </span>
          <span className="text-gray-400 text-sm">/10</span>
        </div>
      </div>

      {/* Summary */}
      <p className="text-sm text-gray-700 leading-relaxed">{result.summary}</p>

      {/* Strengths & Concerns */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-green-700 mb-2">
            Strengths
          </h3>
          <ul className="space-y-1">
            {result.strengths.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700">
                <span className="text-green-500 mt-0.5">✓</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-red-700 mb-2">
            Concerns
          </h3>
          <ul className="space-y-1">
            {result.concerns.map((c, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700">
                <span className="text-red-400 mt-0.5">✗</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommended Action */}
      <div className="rounded-lg bg-gray-100 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
          Recommended Action
        </p>
        <p className="text-sm font-medium text-gray-800">
          {result.recommendedAction}
        </p>
      </div>
    </div>
  );
}

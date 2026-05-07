"use client";

import { useState } from "react";
import { useRealtimeRun } from "@trigger.dev/react-hooks";
import LeadForm from "@/components/LeadForm";
import QualificationResult from "@/components/QualificationResult";
import type { LeadPayload, QualificationResult as QResult } from "@/lib/types";

interface RunHandle {
  runId: string;
  publicToken: string;
}

export default function Home() {
  const [handle, setHandle] = useState<RunHandle | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { run } = useRealtimeRun(handle?.runId ?? "", {
    enabled: !!handle,
    accessToken: handle?.publicToken ?? "",
  });

  const isLoading =
    isSubmitting ||
    (!!handle && run?.status !== "COMPLETED" && run?.status !== "FAILED");

  const result = run?.status === "COMPLETED"
    ? (run.output as QResult)
    : null;

  const handleSubmit = async (payload: LeadPayload) => {
    setIsSubmitting(true);
    setHandle(null);
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to start analysis");

      const data: RunHandle = await res.json();
      setHandle(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight">AI Lead Qualifier</h1>
        <p className="mt-2 text-gray-500 text-sm">
          Fill in the lead details and click Analyze to get an instant AI qualification.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Form */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold mb-5">Lead Information</h2>
          <LeadForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        {/* Result */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold mb-5">Qualification Result</h2>

          {!handle && !error && (
            <div className="flex h-48 items-center justify-center text-sm text-gray-400">
              Results will appear here after analysis.
            </div>
          )}

          {isLoading && !result && (
            <div className="flex h-48 items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                Analyzing with AI...
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {run?.status === "FAILED" && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              Analysis failed. Please try again.
            </div>
          )}

          {result && <QualificationResult result={result} />}
        </div>
      </div>
    </main>
  );
}

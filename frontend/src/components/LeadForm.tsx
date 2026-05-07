"use client";

import { useState } from "react";
import type { LeadPayload } from "@/lib/types";

interface Props {
  onSubmit: (payload: LeadPayload) => void;
  isLoading: boolean;
}

const COMPANY_SIZES: LeadPayload["companySize"][] = [
  "1-10",
  "11-50",
  "51-200",
  "200+",
];

const BUDGET_RANGES: LeadPayload["budgetRange"][] = [
  "< $1k",
  "$1k-$5k",
  "$5k-$20k",
  "$20k+",
];

export default function LeadForm({ onSubmit, isLoading }: Props) {
  const [form, setForm] = useState<LeadPayload>({
    companyName: "",
    companySize: "11-50",
    industry: "",
    budgetRange: "$1k-$5k",
    painPoints: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1">Company Name</label>
        <input
          name="companyName"
          value={form.companyName}
          onChange={handleChange}
          required
          placeholder="Acme Corp"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Company Size</label>
          <select
            name="companySize"
            value={form.companySize}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {COMPANY_SIZES.map((s) => (
              <option key={s} value={s}>
                {s} employees
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Budget Range</label>
          <select
            name="budgetRange"
            value={form.budgetRange}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {BUDGET_RANGES.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Industry / Niche</label>
        <input
          name="industry"
          value={form.industry}
          onChange={handleChange}
          required
          placeholder="e.g. SaaS, E-commerce, Healthcare"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Pain Points / Notes
        </label>
        <textarea
          name="painPoints"
          value={form.painPoints}
          onChange={handleChange}
          required
          rows={4}
          placeholder="Describe the prospect's problem, current situation, or anything notable about them..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? "Analyzing..." : "Analyze Lead"}
      </button>
    </form>
  );
}

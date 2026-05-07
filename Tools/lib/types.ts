export interface LeadPayload {
  companyName: string;
  companySize: "1-10" | "11-50" | "51-200" | "200+";
  industry: string;
  budgetRange: "< $1k" | "$1k-$5k" | "$5k-$20k" | "$20k+";
  painPoints: string;
}

export interface QualificationResult {
  score: number;
  tier: "Hot" | "Warm" | "Cold";
  summary: string;
  strengths: string[];
  concerns: string[];
  recommendedAction: string;
}

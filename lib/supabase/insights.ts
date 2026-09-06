import { supabase } from "./client";
import type { Insight } from "@/app/actions/analyze-insights";

export async function saveInsights(insights: Array<{
  store_id: string;
  problem_id?: string;
  title: string;
  summary: string;
  analysis: string;
  impact: string;
  recommendation: string;
  priority: string;
  confidence?: number;
}>): Promise<boolean> {
  const { error } = await supabase.from("insights").insert(insights);
  if (error) {
    console.error("Failed to save insight:", error);
    return false;
  }
  return true;
}

export async function fetchInsights(storeId: string): Promise<Insight[]> {
  try {
    const { data, error } = await supabase
      .from("insights")
      .select("*")
      .eq("store_id", storeId)
      .order("created_at", { ascending: false });

    if (error || !data) {
      return [];
    }

    return data.map((row) => ({
      id: row.id,
      storeId: row.store_id,
      problemId: row.problem_id || undefined,
      title: row.title,
      summary: row.summary,
      analysis: row.analysis,
      impact: row.impact,
      recommendation: row.recommendation,
      priority: row.priority,
      confidence: row.confidence || undefined,
      createdAt: row.created_at,
    }));
  } catch {
    return [];
  }
}

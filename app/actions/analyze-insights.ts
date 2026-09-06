"use server";

import type { DetectedProblem, ProblemSeverity } from "@/lib/supabase/problems";

export type InsightPriority = "critical" | "high" | "medium" | "low";

export interface Insight {
  id: string;
  storeId: string;
  problemId?: string;
  title: string;
  summary: string;
  analysis: string;
  impact: string;
  recommendation: string;
  priority: InsightPriority;
  confidence?: number;
  createdAt: string;
}

const GROQ_API_KEY = process.env.GROQ_KEY;

function formatCurrency(value: number): string {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

async function callGroq(prompt: string): Promise<string> {
  if (!GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are an expert e-commerce revenue intelligence analyst.

Analyze ONLY the real structured application data provided in the input.

Your objective is to detect the most meaningful and actionable:
- revenue problems
- revenue opportunities
- customer trends
- product trends
- inventory risks
- revenue recovery opportunities
- actionable recommendations

CORE RULES

1. DATA-ONLY ANALYSIS
Use only facts explicitly present in the provided data.
Never invent, assume, estimate, or fabricate:
- metrics
- revenue
- orders
- customers
- product performance
- inventory levels
- customer behavior
- causes
- trends
- business conditions

If a metric cannot be calculated from the provided data, do not mention it.

2. EVIDENCE FIRST
Every insight must be supported by one or more observable data points.

Clearly separate:
- Observed fact: what the data directly shows.
- Interpretation: what that pattern may indicate.

Do not present an interpretation as a confirmed fact.

3. CALCULATE ONLY WHEN VALID
You may calculate derived metrics only from the provided data, such as:
- revenue differences
- percentage changes
- averages
- order rates
- conversion-related metrics when the required data exists
- product/customer comparisons
- inventory ratios

Do not calculate a metric when required source data is missing.

4. NO GENERIC ADVICE
Recommendations must directly address the specific evidence found.

Bad:
"Improve marketing to increase sales."

Good:
"Prioritize the two products generating the largest share of revenue because they account for most observed sales."

5. PRIORITIZE BUSINESS VALUE
Return only insights that are materially useful to the store.

Prioritize:
- direct revenue loss
- recoverable revenue
- high-value opportunities
- serious inventory risks
- significant customer/product trends

Do not generate insights merely to increase the number of results.

6. AVOID DUPLICATES
Do not generate multiple insights describing the same underlying issue.
Combine closely related findings into one stronger insight.

7. CAUSALITY
Do not claim that one metric caused another unless the provided data directly proves the relationship.

Use wording such as:
- "may indicate"
- "is associated with"
- "the data suggests"

when causation is not established.

8. INSUFFICIENT DATA
If the available data does not provide enough evidence for a meaningful insight, do not generate one.

Do not fill missing information with assumptions.

9. PRIORITY
Assign priority based on the strength of the evidence and potential business impact:

- critical: severe or urgent revenue/inventory issue with strong evidence
- high: significant revenue problem, opportunity, or risk with strong evidence
- medium: meaningful but less urgent finding
- low: useful minor finding with limited business impact

Do not assign critical/high priority without sufficient evidence.

10. CONFIDENCE
Confidence must be a number between 0 and 1.

Base confidence on:
- data completeness
- strength of the observed pattern
- consistency of supporting metrics
- reliability of the comparison

Use higher confidence when the evidence is direct and complete.
Use lower confidence when the insight depends on limited or indirect evidence.

Never use confidence to compensate for missing data.

11. PROBLEM ID
Use the provided problem ID when the insight directly relates to an existing revenue problem.

Otherwise use null.

Never invent a problem ID.

12. OUTPUT
Return ONLY valid JSON.
Do not include:
- Markdown
- code fences
- explanations outside JSON
- comments
- extra fields

Return this exact schema:

[
  {
    "problemId": string|null,
    "type": "problem"|"opportunity"|"trend"|"recommendation",
    "title": string,
    "summary": string,
    "analysis": string,
    "impact": string,
    "recommendation": string,
    "priority": "critical"|"high"|"medium"|"low",
    "confidence": number
  }
]

FIELD REQUIREMENTS

title:
Short, specific description of the insight.

summary:
One concise statement of what was detected.

analysis:
Explain the evidence and relevant calculations.
Clearly distinguish observed facts from interpretation.

impact:
Describe the actual or potential business impact supported by the data.
Do not invent monetary impact when it cannot be calculated.

recommendation:
Give a specific, actionable next step directly supported by the evidence.
If no meaningful action can be justified, do not generate the insight.

type:
- problem = observed negative condition
- opportunity = evidence of potential revenue growth/recovery
- trend = meaningful customer/product/revenue pattern
- recommendation = actionable conclusion supported by the data

QUALITY CONTROL BEFORE OUTPUT

For every insight, verify:

- Is every factual claim present in the input data?
- Are all calculations mathematically valid?
- Is the interpretation clearly distinguishable from fact?
- Is the recommendation supported by the evidence?
- Is the insight materially useful?
- Is it different from the other insights?
- Is the priority justified?
- Is the confidence justified?
- Would the insight still be valid if no assumptions were made?

If any answer is NO, remove or revise the insight.

Return an empty array [] when no meaningful evidence-based insight can be identified.`,
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.error?.message || "AI request failed");
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

function generateRuleBasedInsights(problems: DetectedProblem[]): Omit<Insight, "id" | "storeId" | "createdAt">[] {
  const insights: Omit<Insight, "id" | "storeId" | "createdAt">[] = [];

  for (const problem of problems) {
    switch (problem.type) {
      case "revenue_drop": {
        const priority: InsightPriority = problem.changePercentage < -30 ? "critical" : "high";
        insights.push({
          problemId: problem.id,
          title: "Revenue decline detected",
          summary: `Revenue dropped ${Math.abs(problem.changePercentage).toFixed(1)}% compared with the previous period.`,
          analysis: `Current revenue is ${formatCurrency(problem.currentValue)} versus ${formatCurrency(problem.previousValue)} in the prior period. This represents a ${Math.abs(problem.changePercentage).toFixed(1)}% decrease.`,
          impact: `Estimated revenue at risk: ${formatCurrency(problem.estimatedImpact || (problem.previousValue - problem.currentValue))}`,
          recommendation: "Review recent order trends, top-performing products, and checkout performance. Check for any recent changes in marketing, pricing, or product availability.",
          priority,
          confidence: 0.85,
        });
        break;
      }
      case "order_drop": {
        const priority: InsightPriority = problem.changePercentage < -30 ? "critical" : "high";
        insights.push({
          problemId: problem.id,
          title: "Order volume decline detected",
          summary: `Order volume dropped ${Math.abs(problem.changePercentage).toFixed(1)}% compared with the previous period.`,
          analysis: `Current orders: ${problem.currentValue.toFixed(0)}. Previous orders: ${problem.previousValue.toFixed(0)}. This indicates reduced customer interest or conversion issues.`,
          impact: `Revenue impact: ${formatCurrency(problem.estimatedImpact || 0)}`,
          recommendation: "Check marketing campaigns, product availability, and checkout flow. Consider running a promotion or reviewing the customer journey for friction points.",
          priority,
          confidence: 0.8,
        });
        break;
      }
      case "product_decline": {
        const productName = (problem.metadata as { productName?: string })?.productName || "A product";
        insights.push({
          problemId: problem.id,
          title: `Sales declined for ${productName}`,
          summary: `This product's sales dropped significantly compared with the previous period.`,
          analysis: problem.description,
          impact: `Units sold changed from ${problem.previousValue.toFixed(0)} to ${problem.currentValue.toFixed(0)}.`,
          recommendation: "Review product pricing, inventory levels, and customer feedback. Consider updating product descriptions, images, or running targeted promotions.",
          priority: "medium",
          confidence: 0.75,
        });
        break;
      }
      case "low_stock": {
        const productName = (problem.metadata as { productName?: string })?.productName || "A product";
        const isOutOfStock = problem.currentValue === 0;
        insights.push({
          problemId: problem.id,
          title: isOutOfStock ? `${productName} is out of stock` : `Low stock: ${productName}`,
          summary: isOutOfStock
            ? `${productName} has no remaining inventory and cannot be purchased.`
            : `Only ${problem.currentValue.toFixed(0)} units of ${productName} remaining.`,
          analysis: problem.description,
          impact: isOutOfStock ? "Potential revenue loss from unavailable product." : "Risk of stockout if demand continues.",
          recommendation: "Review inventory and restock the affected product. Check supplier lead times and consider setting up low-stock alerts.",
          priority: isOutOfStock ? "critical" : "medium",
          confidence: 0.95,
        });
        break;
      }
      case "customer_inactivity": {
        const churnedCount = (problem.metadata as { churnedCount?: number })?.churnedCount || 0;
        insights.push({
          problemId: problem.id,
          title: "Customer activity declined",
          summary: `${churnedCount} previous customers made no purchases this period.`,
          analysis: problem.description,
          impact: `Potential recurring revenue at risk from ${churnedCount} inactive customers.`,
          recommendation: "Launch a re-engagement campaign or review the customer experience. Consider win-back emails, loyalty programs, or special offers.",
          priority: "medium",
          confidence: 0.7,
        });
        break;
      }
    }
  }

  return insights;
}

export async function generateInsights(
  problems: DetectedProblem[],
  storeId: string
): Promise<Insight[]> {
  if (problems.length === 0) {
    return [];
  }

  let aiResults: Array<{
    problemId?: string;
    title: string;
    summary: string;
    analysis: string;
    impact: string;
    recommendation: string;
    priority: InsightPriority;
    confidence?: number;
  }>;

  if (GROQ_API_KEY) {
    const problemContext = problems
      .map((p) => {
        const lines = [
          `[Problem Type] ${p.type}`,
          `[Title] ${p.title}`,
          `[Description] ${p.description}`,
          `[Current Value] ${p.currentValue.toFixed(2)}`,
          `[Previous Value] ${p.previousValue.toFixed(2)}`,
          `[Change %] ${p.changePercentage.toFixed(1)}`,
          `[Estimated Impact] ${formatCurrency(p.estimatedImpact)}`,
          `[Severity] ${p.severity}`,
        ];
        return lines.join("\n");
      })
      .join("\n\n---\n\n");

    const userPrompt = `Store problems to analyze:\n\n${problemContext}\n\nGenerate insights for each problem.`;

    try {
      const aiResponse = await callGroq(userPrompt);
      const parsed = JSON.parse(aiResponse);
      if (Array.isArray(parsed)) {
        aiResults = parsed;
      } else {
        throw new Error("Invalid response format");
      }
    } catch {
      aiResults = generateRuleBasedInsights(problems);
    }
  } else {
    aiResults = generateRuleBasedInsights(problems);
  }

  const now = new Date().toISOString();
  return aiResults.map((r) => ({
    id: `${r.problemId || now}`,
    storeId,
    problemId: r.problemId,
    title: r.title,
    summary: r.summary,
    analysis: r.analysis,
    impact: r.impact,
    recommendation: r.recommendation,
    priority: r.priority,
    confidence: r.confidence,
    createdAt: now,
  }));
}

export async function fetchInsightsByStore(storeId: string): Promise<Insight[]> {
  return [];
}

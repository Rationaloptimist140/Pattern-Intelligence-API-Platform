export interface AnalyzeRequest {
  text: string;
  patterns: string[];
}

export interface PatternMatch {
  pattern: string;
  occurrences: number;
  positions: number[];
  samples: string[];
}

export interface AnalyzeResponse {
  matches: PatternMatch[];
  metadata: {
    totalPatterns: number;
    processingTime: string;
  };
}

const API_URL = process.env.NEXT_PUBLIC_PATTERN_API_URL ?? 'http://localhost:3000/api/analyze';

export async function analyzeText(payload: AnalyzeRequest): Promise<AnalyzeResponse> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
    cache: 'no-store'
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = typeof body?.error === 'string' ? body.error : `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return body as AnalyzeResponse;
}

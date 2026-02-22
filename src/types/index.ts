export interface AnalyzeRequestBody {
  text: string;
  patterns: string[];
}

export interface PatternMatchResult {
  pattern: string;
  occurrences: number;
  positions: number[];
  samples: string[];
}

export interface AnalyzeResponse {
  matches: PatternMatchResult[];
  metadata: {
    totalPatterns: number;
    processingTime: string;
  };
}

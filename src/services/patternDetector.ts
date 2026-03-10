import { PatternMatchResult } from '../types';

const MAX_SAMPLES = 5;

const REGEX_PATTERN_FORMAT = /^\/(.*)\/([dgimsuvy]*)$/;

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const toGlobalRegex = (pattern: string): RegExp => {
  const regexParts = pattern.match(REGEX_PATTERN_FORMAT);

  if (!regexParts) {
    return new RegExp(escapeRegExp(pattern), 'g');
  }

  const [, source, rawFlags] = regexParts;
  const dedupedFlags = Array.from(new Set(rawFlags.replace(/g/g, '').split(''))).join('');

  return new RegExp(source, `${dedupedFlags}g`);
};

export const detectPattern = (text: string, pattern: string): PatternMatchResult => {
  const matcher = toGlobalRegex(pattern);
  const positions: number[] = [];
  const samples: string[] = [];

  let match = matcher.exec(text);

  while (match) {
    positions.push(match.index);
    if (samples.length < MAX_SAMPLES) {
      samples.push(match[0]);
    }

    if (match[0].length === 0) {
      matcher.lastIndex += 1;
    }

    match = matcher.exec(text);
  }

  return {
    pattern,
    occurrences: positions.length,
    positions,
    samples
  };
};

export const analyzePatterns = (text: string, patterns: string[]) => {
  const start = process.hrtime.bigint();
  const matches = patterns.map((pattern) => detectPattern(text, pattern));
  const end = process.hrtime.bigint();

  return {
    matches,
    metadata: {
      totalPatterns: patterns.length,
      processingTime: `${Number(end - start) / 1_000_000}ms`
    }
  };
};

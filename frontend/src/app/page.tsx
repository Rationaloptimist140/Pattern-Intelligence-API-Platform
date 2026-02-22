'use client';

import { useMemo, useState } from 'react';
import { analyzeText, AnalyzeResponse } from '../lib/api';
import { Alert } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { PatternInputList } from '../components/ui/pattern-input-list';
import { TextArea } from '../components/ui/text-area';

const MAX_TEXT = 50000;
const MAX_PATTERNS = 10;

export default function DashboardPage() {
  const [text, setText] = useState('');
  const [patterns, setPatterns] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<AnalyzeResponse | null>(null);

  const totalMatches = useMemo(
    () => result?.matches.reduce((acc, item) => acc + item.occurrences, 0) ?? 0,
    [result]
  );

  const handleAnalyze = async () => {
    setError('');

    const filteredPatterns = patterns.map((p) => p.trim()).filter(Boolean);

    if (!text.trim()) {
      setError('Please enter text before running analysis.');
      return;
    }

    if (text.length > MAX_TEXT) {
      setError(`Text exceeds ${MAX_TEXT.toLocaleString()} character limit.`);
      return;
    }

    if (filteredPatterns.length < 1 || filteredPatterns.length > MAX_PATTERNS) {
      setError(`Please provide between 1 and ${MAX_PATTERNS} valid patterns.`);
      return;
    }

    try {
      setLoading(true);
      const data = await analyzeText({ text, patterns: filteredPatterns });
      setResult(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected error occurred during analysis.';
      setError(message);
      window.alert(`Pattern Intelligence API error: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 px-6 py-8 text-slate-100 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex items-end justify-between border-b border-slate-800 pb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">Pattern Intelligence</p>
            <h1 className="mt-2 text-3xl font-bold">Analysis Dashboard</h1>
          </div>
          <span className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
            Connected to localhost:3000
          </span>
        </header>

        {error ? (
          <div className="mb-4">
            <Alert message={error} onClose={() => setError('')} />
          </div>
        ) : null}

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6 shadow-glow">
            <h2 className="mb-5 text-lg font-semibold text-cyan-300">Analysis Configuration</h2>
            <div className="space-y-5">
              <TextArea value={text} onChange={setText} maxLength={MAX_TEXT} />
              <PatternInputList patterns={patterns} onChange={setPatterns} maxItems={MAX_PATTERNS} />
              <Button loading={loading} onClick={handleAnalyze} className="w-full">
                Analyze Patterns
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6 shadow-glow">
            <h2 className="mb-5 text-lg font-semibold text-cyan-300">Intelligence Results</h2>

            <div className="mb-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="text-xs text-slate-400">Total Matches</p>
                <p className="mt-2 text-2xl font-semibold text-cyan-400">{totalMatches}</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="text-xs text-slate-400">Processing Time</p>
                <p className="mt-2 text-2xl font-semibold text-cyan-400">{result?.metadata.processingTime ?? '--'}</p>
              </div>
            </div>

            <div className="max-h-[560px] space-y-3 overflow-y-auto pr-1">
              {result?.matches.length ? (
                result.matches.map((item, idx) => (
                  <article key={`${item.pattern}-${idx}`} className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-medium text-cyan-300">{item.pattern}</h3>
                      <span className="rounded-md bg-cyan-500/20 px-2 py-1 text-xs text-cyan-300">
                        {item.occurrences} occurrences
                      </span>
                    </div>
                    <div className="space-y-2">
                      {item.samples.slice(0, 3).map((sample, sampleIndex) => (
                        <p key={`${sample}-${sampleIndex}`} className="rounded-md border border-slate-800 bg-slate-950/70 p-2 text-sm text-slate-300">
                          {sample}
                        </p>
                      ))}
                      {!item.samples.length ? <p className="text-sm text-slate-500">No sample snippets found.</p> : null}
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center text-sm text-slate-400">
                  No analysis yet. Submit text and patterns to view intelligence results.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

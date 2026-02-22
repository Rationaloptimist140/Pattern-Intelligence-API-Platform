'use client';

type PatternInputListProps = {
  patterns: string[];
  onChange: (patterns: string[]) => void;
  maxItems?: number;
};

export function PatternInputList({ patterns, onChange, maxItems = 10 }: PatternInputListProps) {
  const update = (index: number, value: string) => {
    const next = [...patterns];
    next[index] = value;
    onChange(next);
  };

  const addPattern = () => {
    if (patterns.length < maxItems) {
      onChange([...patterns, '']);
    }
  };

  const removePattern = (index: number) => {
    onChange(patterns.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-300">Patterns</label>
        <span className="text-xs text-slate-400">{patterns.length}/{maxItems}</span>
      </div>

      {patterns.map((pattern, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            value={pattern}
            onChange={(event) => update(index, event.target.value)}
            placeholder={index === 0 ? 'error' : '/\\d+/g'}
            className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-500/50 placeholder:text-slate-500 focus:ring"
          />
          <button
            type="button"
            onClick={() => removePattern(index)}
            className="rounded-md border border-slate-700 px-3 py-2 text-xs text-slate-300 hover:border-cyan-500 hover:text-cyan-400"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addPattern}
        disabled={patterns.length >= maxItems}
        className="w-full rounded-lg border border-dashed border-slate-600 px-4 py-2 text-sm text-slate-300 hover:border-cyan-500 hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        + Add Pattern
      </button>
    </div>
  );
}

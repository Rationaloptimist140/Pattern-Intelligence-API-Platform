'use client';

type TextAreaProps = {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
};

export function TextArea({ value, onChange, maxLength = 50000 }: TextAreaProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-300">Input Text</label>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value.slice(0, maxLength))}
        placeholder="Paste logs, emails, documents, or raw text to analyze..."
        className="h-64 w-full rounded-xl border border-slate-700 bg-slate-950/60 p-4 text-sm text-slate-100 outline-none ring-cyan-500/50 placeholder:text-slate-500 focus:ring"
      />
      <p className="text-right text-xs text-slate-400">{value.length.toLocaleString()} / {maxLength.toLocaleString()}</p>
    </div>
  );
}

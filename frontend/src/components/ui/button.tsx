'use client';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

export function Button({ loading = false, children, className = '', disabled, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? 'Analyzing...' : children}
    </button>
  );
}

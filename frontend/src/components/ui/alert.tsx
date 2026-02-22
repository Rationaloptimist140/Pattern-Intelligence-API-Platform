'use client';

type AlertProps = {
  message: string;
  onClose: () => void;
};

export function Alert({ message, onClose }: AlertProps) {
  return (
    <div className="rounded-lg border border-rose-600/50 bg-rose-950/40 p-3 text-sm text-rose-200 shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <p>{message}</p>
        <button onClick={onClose} className="text-rose-200/80 hover:text-white">
          ✕
        </button>
      </div>
    </div>
  );
}

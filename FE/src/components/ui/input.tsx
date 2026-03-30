import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        {...props}
      />
      {error && <span className="text-xs text-rose-600">{error}</span>}
    </div>
  );
}

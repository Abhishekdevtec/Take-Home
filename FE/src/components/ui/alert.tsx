import React from 'react';

type AlertProps = {
  message: string;
  type: 'success' | 'error';
};

export default function Alert({ message, type }: AlertProps) {
  return (
    <div className={`fixed top-4 left-1/2 z-50 w-[min(92vw,680px)] -translate-x-1/2 rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${
      type === 'success' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'bg-rose-50 text-rose-700 ring-1 ring-rose-200'
    }`}>
      {message}
    </div>
  );
}

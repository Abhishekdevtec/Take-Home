import React from 'react';
import Button from './button';

type ModalProps = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({ title, isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500" />
            <span className="text-xl font-bold text-slate-900">{title}</span>
          </div>
          <Button variant="ghost" onClick={onClose} className="text-slate-500 hover:text-slate-700">✕</Button>
        </div>
        {children}
      </div>
    </div>
  );
}

import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
};

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
};

export default function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

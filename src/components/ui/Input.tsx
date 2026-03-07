import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, className = "", id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full bg-white border border-navy-100 rounded-lg px-3 py-2.5 text-base text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary-light outline-none transition-colors ${className}`}
        {...props}
      />
    </div>
  );
}

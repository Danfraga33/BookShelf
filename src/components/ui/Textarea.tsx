import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export default function Textarea({
  label,
  className = "",
  id,
  ...props
}: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-lg font-medium text-text-primary">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`w-full bg-white border border-navy-100 rounded-lg px-3 py-2.5 text-base text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary-light outline-none transition-colors min-h-[100px] resize-y ${className}`}
        {...props}
      />
    </div>
  );
}

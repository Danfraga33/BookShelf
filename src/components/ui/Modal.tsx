import { useEffect, useRef } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

export default function Modal({ open, onClose, children, title }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-8 pb-6">
          <h2 className="font-display text-5xl font-bold text-text-primary leading-tight">{title}</h2>
          <p className="text-text-muted text-lg mt-1">Add a new title</p>
        </div>
        <div className="h-px bg-navy-100 mx-8" />
        
        <div className="px-8 py-6">
          {children}
        </div>
      </div>
    </div>
  );
}

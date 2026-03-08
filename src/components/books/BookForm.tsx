import { useState } from "react";
import Input from "~/components/ui/Input";
import Textarea from "~/components/ui/Textarea";

interface BookFormProps {
  initialTitle?: string;
  initialDescription?: string;
  onSubmit: (title: string, description: string) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
}

export default function BookForm({
  initialTitle = "",
  initialDescription = "",
  onSubmit,
  onCancel,
  submitLabel,
}: BookFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    await onSubmit(title.trim(), description.trim());
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-5">
        <Input
          id="book-title"
          label="Title"
          placeholder="Enter book title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
        />
        <Textarea
          id="book-description"
          label="Description"
          placeholder="A brief description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      </div>
      <div className="h-px bg-navy-100 -mx-8 mt-6" />
      <div className="flex justify-end gap-3 pt-5 -mx-8 px-8 pb-2">
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer px-8 py-3 rounded-4xl text-base font-medium text-text-secondary border border-navy-200 hover:bg-surface transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!title.trim() || submitting}
          className="cursor-pointer px-8 py-3 rounded-4xl text-base font-medium bg-[#1a2533] text-white hover:bg-[#0f1820] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

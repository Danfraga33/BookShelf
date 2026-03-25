import { useState, useRef, useEffect } from "react";
import type { Book } from "~/hooks/useBooks";
import type { Shelf } from "~/hooks/useShelves";
import BookCard from "~/components/books/BookCard";

interface ShelfGroupProps {
  shelf: Shelf;
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
  onRename: (id: string, name: string) => Promise<unknown>;
  onDeleteShelf: (shelf: Shelf) => void;
}

export default function ShelfGroup({
  shelf,
  books,
  onEdit,
  onDelete,
  onRename,
  onDeleteShelf,
}: ShelfGroupProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(shelf.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const handleRenameSubmit = async () => {
    const trimmed = editName.trim();
    if (trimmed && trimmed !== shelf.name) {
      await onRename(shelf.id, trimmed);
    } else {
      setEditName(shelf.name);
    }
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleRenameSubmit();
    if (e.key === "Escape") {
      setEditName(shelf.name);
      setEditing(false);
    }
  };

  return (
    <section className="mb-8">
      {/* Shelf header */}
      <div className="group/shelf flex items-center justify-between py-3">
        <div className="flex items-center gap-2">
          {/* Collapse chevron */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="cursor-pointer p-1 text-navy-400 hover:text-navy-800 transition-colors"
            title={collapsed ? "Expand" : "Collapse"}
          >
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${collapsed ? "-rotate-90" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Shelf name / inline edit */}
          {editing ? (
            <input
              ref={inputRef}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleRenameSubmit}
              onKeyDown={handleKeyDown}
              className="font-heading font-semibold text-lg text-text-primary bg-transparent border-b-2 border-primary outline-none px-1 py-0"
            />
          ) : (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="cursor-pointer font-heading font-bold text-lg text-text-primary hover:text-primary transition-colors"
            >
              {shelf.name}
            </button>
          )}

          <span className="text-sm text-text-muted">
            ({books.length})
          </span>
        </div>

        {/* Shelf actions — always visible on mobile, hover on desktop */}
        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover/shelf:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => {
              setEditName(shelf.name);
              setEditing(true);
            }}
            className="cursor-pointer p-1.5 text-navy-400 hover:text-navy-800 hover:bg-navy-100 rounded-lg transition-colors"
            title="Rename shelf"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDeleteShelf(shelf)}
            className="cursor-pointer p-1.5 text-navy-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
            title="Delete shelf"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Book grid — collapsible */}
      {!collapsed && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 mt-1">
          {books.length > 0 ? (
            books.map((book) => (
              <BookCard key={book.id} book={book} onEdit={onEdit} onDelete={onDelete} />
            ))
          ) : (
            <p className="col-span-full text-sm text-text-muted py-4">
              No books in this shelf yet.
            </p>
          )}
        </div>
      )}
    </section>
  );
}

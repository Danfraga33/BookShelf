import type { Book } from "~/hooks/useBooks";
import BookCard from "./BookCard";

interface BookGridProps {
  books: Book[];
  loading: boolean;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
  onCreateFirst?: () => void;
}

function BookGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="w-full rounded-lg bg-navy-100" style={{ paddingBottom: "133%" }} />
          <div className="mt-3 space-y-2">
            <div className="h-3 bg-navy-100 rounded w-3/4" />
            <div className="h-3 bg-navy-100 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-slide-up">
      {/* Bookshelf illustration */}
      <div className="w-48 h-48 mb-8 relative">
          <img src="/books.jpg" className="rounded-xl "  alt="" />
      </div>
      <h3 className="font-display text-4xl font-bold text-text-primary mb-2">
        Your Bookshelf is empty
      </h3>
      <p className="text-text-secondary text-sm max-w-sm mb-8">
        Start organizing your notes, tracking your reading,
        and capturing thoughts by creating your first book.
      </p>
      {onCreate && (
        <button
          onClick={onCreate}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create your first book
        </button>
      )}
    </div>
  );
}

export default function BookGrid({
  books,
  loading,
  onEdit,
  onDelete,
  onCreateFirst,
}: BookGridProps) {
  if (loading) return <BookGridSkeleton />;
  if (books.length === 0) return <EmptyState onCreate={onCreateFirst} />;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

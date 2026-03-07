import { useState } from "react";
import { useBooks } from "~/hooks/useBooks";
import type { Book } from "~/hooks/useBooks";
import { useAuth } from "~/hooks/useAuth";
import BookGrid from "~/components/books/BookGrid";
import BookForm from "~/components/books/BookForm";
import DeleteConfirmModal from "~/components/books/DeleteConfirmModal";
import Modal from "~/components/ui/Modal";
import Button from "~/components/ui/Button";

export default function DashboardPage() {
  const { books, loading, createBook, updateBook, deleteBook } = useBooks();
  const { user, signOut } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-white border-b border-navy-100 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="font-heading font-bold text-lg text-text-primary">
            Bookshelf
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setShowCreateModal(true)}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Book
          </Button>
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold select-none">
            {user?.email?.[0]?.toUpperCase() ?? "?"}
          </div>
          <button
            onClick={signOut}
            title="Sign out"
            className="cursor-pointer p-1.5 text-navy-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <BookGrid
          books={books}
          loading={loading}
          onEdit={setEditingBook}
          onDelete={setDeletingBook}
          onCreateFirst={() => setShowCreateModal(true)}
        />
      </main>

      {/* Create modal */}
      <Modal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Book"
      >
        <BookForm
          onSubmit={async (title, description) => {
            await createBook(title, description);
            setShowCreateModal(false);
          }}
          onCancel={() => setShowCreateModal(false)}
          submitLabel="Create Book"
        />
      </Modal>

      {/* Edit modal */}
      <Modal
        open={!!editingBook}
        onClose={() => setEditingBook(null)}
        title="Edit Book"
      >
        {editingBook && (
          <BookForm
            initialTitle={editingBook.title}
            initialDescription={editingBook.description ?? ""}
            onSubmit={async (title, description) => {
              await updateBook(editingBook.id, { title, description });
              setEditingBook(null);
            }}
            onCancel={() => setEditingBook(null)}
            submitLabel="Save Changes"
          />
        )}
      </Modal>

      {/* Delete modal */}
      <DeleteConfirmModal
        open={!!deletingBook}
        onClose={() => setDeletingBook(null)}
        onConfirm={async () => {
          if (deletingBook) await deleteBook(deletingBook.id);
        }}
        itemName={deletingBook?.title ?? ""}
      />
    </div>
  );
}

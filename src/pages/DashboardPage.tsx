import { useState, useRef, useEffect } from "react";
import { useBooks } from "~/hooks/useBooks";
import type { Book } from "~/hooks/useBooks";
import { useShelves } from "~/hooks/useShelves";
import type { Shelf } from "~/hooks/useShelves";
import { useTopics } from "~/hooks/useTopics";
import { useAuth } from "~/hooks/useAuth";
import BookGrid from "~/components/books/BookGrid";
import BookForm from "~/components/books/BookForm";
import DeleteConfirmModal from "~/components/books/DeleteConfirmModal";
import ShelfGroup from "~/components/shelves/ShelfGroup";
import BookCard from "~/components/books/BookCard";
import TopicSwitcher from "~/components/topics/TopicSwitcher";
import Modal from "~/components/ui/Modal";

export default function DashboardPage() {
  const {
    topics, loading: topicsLoading, activeTopicId, selectTopic,
    createTopic, renameTopic, deleteTopic,
  } = useTopics();
  const { books, loading: booksLoading, createBook, updateBook, deleteBook, refetch: refetchBooks } = useBooks(activeTopicId);
  const { shelves, loading: shelvesLoading, createShelf, renameShelf, deleteShelf } = useShelves(activeTopicId);
  const { user, signOut } = useAuth();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);
  const [deletingShelf, setDeletingShelf] = useState<Shelf | null>(null);
  const [search, setSearch] = useState("");

  // New shelf inline creation
  const [creatingShelf, setCreatingShelf] = useState(false);
  const [newShelfName, setNewShelfName] = useState("");
  const newShelfInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (creatingShelf) newShelfInputRef.current?.focus();
  }, [creatingShelf]);

  const loading = booksLoading || shelvesLoading || topicsLoading;

  const filteredBooks = books.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  // Group books by shelf
  const booksByShelf = new Map<string | null, Book[]>();
  for (const book of filteredBooks) {
    const key = book.shelf_id;
    if (!booksByShelf.has(key)) booksByShelf.set(key, []);
    booksByShelf.get(key)!.push(book);
  }

  const unshelvedBooks = booksByShelf.get(null) ?? [];

  const handleCreateShelf = async () => {
    const trimmed = newShelfName.trim();
    if (!trimmed) {
      setCreatingShelf(false);
      setNewShelfName("");
      return;
    }
    await createShelf(trimmed);
    setNewShelfName("");
    setCreatingShelf(false);
  };

  const handleDeleteShelfConfirm = async () => {
    if (!deletingShelf) return;
    await deleteShelf(deletingShelf.id);
    // Refetch books since their shelf_id was set to null
    await refetchBooks();
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-white border-b border-navy-100 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-10 gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <svg className="w-5 h-5 shrink-0" style={{ color: "#1a2533" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="font-display font-bold text-2xl text-text-primary leading-none translate-y-px">
            Bookshelf
          </span>
          <div className="w-px h-5 bg-navy-200 mx-1" />
          <TopicSwitcher
            topics={topics}
            activeTopicId={activeTopicId}
            onSelect={selectTopic}
            onCreate={createTopic}
            onRename={renameTopic}
            onDelete={deleteTopic}
          />
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 text-sm border border-navy-200 rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 w-28 sm:w-52"
            />
          </div>
          <div className="w-8 h-8 rounded-full bg-[#1a2533] text-white flex items-center justify-center text-sm font-semibold select-none shrink-0">
            {user?.email?.[0]?.toUpperCase() ?? "?"}
          </div>
          <button
            onClick={signOut}
            title="Sign out"
            className="cursor-pointer p-1.5 text-navy-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors duration-200 shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Dashboard heading + action buttons */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl text-text-primary leading-tight">My Books</h1>
            <p className="text-text-secondary text-sm mt-1">Manage and organize your reading collection.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCreatingShelf(true)}
              className="cursor-pointer flex items-center gap-2 px-4 py-2.5 border border-navy-200 text-text-primary rounded-xl font-display font-semibold text-sm hover:bg-surface transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-base leading-none translate-y-px">New Shelf</span>
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="cursor-pointer flex justify-center items-center gap-2 px-5 py-2.5 bg-[#1a2533] hover:bg-[#0f1820] text-white rounded-xl font-display font-semibold text-sm transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-lg leading-none translate-y-px">New Book</span>
            </button>
          </div>
        </div>

        {/* Inline new shelf input */}
        {creatingShelf && (
          <div className="flex items-center gap-3 mb-6 animate-fade-in">
            <svg className="w-4 h-4 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <input
              ref={newShelfInputRef}
              type="text"
              placeholder="Shelf name..."
              value={newShelfName}
              onChange={(e) => setNewShelfName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateShelf();
                if (e.key === "Escape") {
                  setCreatingShelf(false);
                  setNewShelfName("");
                }
              }}
              onBlur={handleCreateShelf}
              className="font-heading font-semibold text-lg text-text-primary bg-transparent border-b-2 border-primary outline-none px-1 py-0"
            />
            <span className="hidden sm:inline text-sm text-text-muted">Press Enter to create, Escape to cancel</span>
          </div>
        )}

        {loading ? (
          <BookGrid books={[]} loading={true} onEdit={() => {}} onDelete={() => {}} />
        ) : books.length === 0 && shelves.length === 0 ? (
          <BookGrid
            books={[]}
            loading={false}
            onEdit={() => {}}
            onDelete={() => {}}
            onCreateFirst={() => setShowCreateModal(true)}
          />
        ) : (
          <>
            {/* Shelf groups */}
            {shelves.map((shelf) => (
              <ShelfGroup
                key={shelf.id}
                shelf={shelf}
                books={booksByShelf.get(shelf.id) ?? []}
                onEdit={setEditingBook}
                onDelete={setDeletingBook}
                onRename={renameShelf}
                onDeleteShelf={setDeletingShelf}
              />
            ))}

            {/* Unshelved books */}
            {(unshelvedBooks.length > 0 || shelves.length > 0) && (
              <section className="mb-8">
                <div className="flex items-center gap-2 py-3">
                  <h2 className="font-heading font-semibold text-lg text-text-muted">
                    Unshelved
                  </h2>
                  <span className="text-sm text-text-muted">
                    ({unshelvedBooks.length})
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 mt-1">
                  {unshelvedBooks.length > 0 ? (
                    unshelvedBooks.map((book) => (
                      <BookCard key={book.id} book={book} onEdit={setEditingBook} onDelete={setDeletingBook} />
                    ))
                  ) : (
                    <p className="col-span-full text-sm text-text-muted py-4">
                      All books are shelved.
                    </p>
                  )}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* Create book modal */}
      <Modal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="New Book"
      >
        <BookForm
          shelves={shelves}
          onSubmit={async (title, description, shelfId) => {
            await createBook(title, description, shelfId);
            setShowCreateModal(false);
          }}
          onCancel={() => setShowCreateModal(false)}
          submitLabel="Create Book"
        />
      </Modal>

      {/* Edit book modal */}
      <Modal
        open={!!editingBook}
        onClose={() => setEditingBook(null)}
        title="Edit Book"
      >
        {editingBook && (
          <BookForm
            initialTitle={editingBook.title}
            initialDescription={editingBook.description ?? ""}
            initialShelfId={editingBook.shelf_id}
            shelves={shelves}
            onSubmit={async (title, description, shelfId) => {
              await updateBook(editingBook.id, { title, description, shelf_id: shelfId });
              setEditingBook(null);
            }}
            onCancel={() => setEditingBook(null)}
            submitLabel="Save Changes"
          />
        )}
      </Modal>

      {/* Delete book modal */}
      <DeleteConfirmModal
        open={!!deletingBook}
        onClose={() => setDeletingBook(null)}
        onConfirm={async () => {
          if (deletingBook) await deleteBook(deletingBook.id);
        }}
        itemName={deletingBook?.title ?? ""}
      />

      {/* Delete shelf modal */}
      <DeleteConfirmModal
        open={!!deletingShelf}
        onClose={() => setDeletingShelf(null)}
        onConfirm={handleDeleteShelfConfirm}
        itemName={deletingShelf?.name ?? ""}
        itemType="shelf"
      />
    </div>
  );
}

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "~/hooks/useAuth";
import { sql } from "~/lib/db";

export interface Book {
  id: string;
  user_id: string;
  shelf_id: string | null;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export function useBooks() {
  const { user } = useAuth();
  const userId = user?.id;
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  const fetchBooks = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const rows = await sql`
      SELECT * FROM books WHERE user_id = ${userId} ORDER BY updated_at DESC
    `;
    setBooks(rows as Book[]);
    setLoading(false);
    hasFetched.current = true;
  }, [userId]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const createBook = async (title: string, description: string, shelfId?: string | null) => {
    if (!userId) return { error: new Error("Not authenticated") };

    const rows = await sql`
      INSERT INTO books (title, description, user_id, shelf_id)
      VALUES (${title}, ${description}, ${userId}, ${shelfId ?? null})
      RETURNING *
    `;
    const book = rows[0] as Book;

    // Create empty book_content row
    await sql`
      INSERT INTO book_content (book_id, content)
      VALUES (${book.id}, ${JSON.stringify({ type: "doc", content: [] })})
    `;

    setBooks((prev) => [book, ...prev]);
    return { data: book, error: null };
  };

  const updateBook = async (
    id: string,
    updates: { title?: string; description?: string; shelf_id?: string | null }
  ) => {
    // Handle shelf_id separately since COALESCE won't work for setting to null
    if (updates.shelf_id !== undefined) {
      await sql`UPDATE books SET shelf_id = ${updates.shelf_id} WHERE id = ${id}`;
    }
    const rows = await sql`
      UPDATE books
      SET title = COALESCE(${updates.title ?? null}, title),
          description = COALESCE(${updates.description ?? null}, description),
          updated_at = now()
      WHERE id = ${id}
      RETURNING *
    `;
    const book = rows[0] as Book;
    setBooks((prev) => prev.map((b) => (b.id === id ? book : b)));
    return { data: book, error: null };
  };

  const deleteBook = async (id: string) => {
    await sql`DELETE FROM books WHERE id = ${id}`;
    setBooks((prev) => prev.filter((b) => b.id !== id));
    return { error: null };
  };

  return { books, loading, createBook, updateBook, deleteBook, refetch: fetchBooks };
}

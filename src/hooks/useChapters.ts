import { useCallback, useEffect, useState } from "react";
import { sql } from "~/lib/db";

export interface Chapter {
  id: string;
  book_id: string;
  title: string;
  position: number;
  created_at: string;
}

export function useChapters(bookId: string | undefined) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChapters = useCallback(async () => {
    if (!bookId) return;
    setLoading(true);
    const rows = await sql`
      SELECT * FROM chapters WHERE book_id = ${bookId} ORDER BY position ASC
    `;
    setChapters(rows as Chapter[]);
    setLoading(false);
  }, [bookId]);

  useEffect(() => {
    fetchChapters();
  }, [fetchChapters]);

  const addChapter = async (title: string) => {
    if (!bookId) return { error: new Error("No book ID") };
    const nextPosition =
      chapters.length > 0
        ? Math.max(...chapters.map((c) => c.position)) + 1
        : 0;

    const rows = await sql`
      INSERT INTO chapters (book_id, title, position)
      VALUES (${bookId}, ${title}, ${nextPosition})
      RETURNING *
    `;
    const chapter = rows[0] as Chapter;
    setChapters((prev) => [...prev, chapter]);
    return { data: chapter, error: null };
  };

  const renameChapter = async (id: string, title: string) => {
    const rows = await sql`
      UPDATE chapters SET title = ${title} WHERE id = ${id} RETURNING *
    `;
    const chapter = rows[0] as Chapter;
    setChapters((prev) => prev.map((c) => (c.id === id ? chapter : c)));
    return { data: chapter, error: null };
  };

  const deleteChapter = async (id: string) => {
    await sql`DELETE FROM chapters WHERE id = ${id}`;
    setChapters((prev) => prev.filter((c) => c.id !== id));
    return { error: null };
  };

  const reorderChapters = async (reordered: Chapter[]) => {
    setChapters(reordered);
    // Update each chapter's position
    await Promise.all(
      reordered.map((c, i) =>
        sql`UPDATE chapters SET position = ${i} WHERE id = ${c.id}`
      )
    );
  };

  return {
    chapters,
    loading,
    addChapter,
    renameChapter,
    deleteChapter,
    reorderChapters,
    refetch: fetchChapters,
  };
}

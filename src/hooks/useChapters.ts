import { useCallback, useEffect, useState } from "react";
import { supabase } from "~/lib/supabase";

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
    const { data, error } = await supabase
      .from("chapters")
      .select("*")
      .eq("book_id", bookId)
      .order("position", { ascending: true });
    if (!error && data) setChapters(data);
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

    const { data, error } = await supabase
      .from("chapters")
      .insert({ book_id: bookId, title, position: nextPosition })
      .select()
      .single();

    if (!error && data) {
      setChapters((prev) => [...prev, data]);
    }
    return { data, error };
  };

  const renameChapter = async (id: string, title: string) => {
    const { data, error } = await supabase
      .from("chapters")
      .update({ title })
      .eq("id", id)
      .select()
      .single();

    if (!error && data) {
      setChapters((prev) => prev.map((c) => (c.id === id ? data : c)));
    }
    return { data, error };
  };

  const deleteChapter = async (id: string) => {
    const { error } = await supabase.from("chapters").delete().eq("id", id);
    if (!error) {
      setChapters((prev) => prev.filter((c) => c.id !== id));
    }
    return { error };
  };

  const reorderChapters = async (reordered: Chapter[]) => {
    setChapters(reordered);
    const updates = reordered.map((c, i) => ({
      id: c.id,
      book_id: c.book_id,
      title: c.title,
      position: i,
      created_at: c.created_at,
    }));
    await supabase.from("chapters").upsert(updates);
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

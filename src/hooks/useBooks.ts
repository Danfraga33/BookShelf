import { useCallback, useEffect, useState } from "react";
import { supabase } from "~/lib/supabase";

export interface Book {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .order("updated_at", { ascending: false });
    if (!error && data) setBooks(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const createBook = async (title: string, description: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: new Error("Not authenticated") };

    const { data, error } = await supabase
      .from("books")
      .insert({ title, description, user_id: user.id })
      .select()
      .single();

    if (!error && data) {
      setBooks((prev) => [data, ...prev]);
      // Create empty book_content row
      await supabase
        .from("book_content")
        .insert({ book_id: data.id, content: { type: "doc", content: [] } });
    }
    return { data, error };
  };

  const updateBook = async (
    id: string,
    updates: { title?: string; description?: string }
  ) => {
    const { data, error } = await supabase
      .from("books")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (!error && data) {
      setBooks((prev) => prev.map((b) => (b.id === id ? data : b)));
    }
    return { data, error };
  };

  const deleteBook = async (id: string) => {
    const { error } = await supabase.from("books").delete().eq("id", id);
    if (!error) {
      setBooks((prev) => prev.filter((b) => b.id !== id));
    }
    return { error };
  };

  return { books, loading, createBook, updateBook, deleteBook, refetch: fetchBooks };
}

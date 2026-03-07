import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "~/lib/supabase";
import type { JSONContent } from "@tiptap/react";

export function useEditor(bookId: string | undefined) {
  const [content, setContent] = useState<JSONContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "idle">(
    "idle"
  );
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchContent = useCallback(async () => {
    if (!bookId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("book_content")
      .select("content")
      .eq("book_id", bookId)
      .single();

    if (!error && data) {
      setContent(data.content as JSONContent);
    } else {
      setContent({ type: "doc", content: [] });
    }
    setLoading(false);
  }, [bookId]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const saveContent = useCallback(
    async (json: JSONContent) => {
      if (!bookId) return;
      setSaveStatus("saving");
      await supabase
        .from("book_content")
        .update({
          content: json,
          updated_at: new Date().toISOString(),
        })
        .eq("book_id", bookId);

      // Also update book's updated_at
      await supabase
        .from("books")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", bookId);

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    },
    [bookId]
  );

  const debouncedSave = useCallback(
    (json: JSONContent) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setSaveStatus("saving");
      timerRef.current = setTimeout(() => {
        saveContent(json);
      }, 1500);
    },
    [saveContent]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { content, loading, saveStatus, debouncedSave };
}

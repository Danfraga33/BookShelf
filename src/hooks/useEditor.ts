import { useCallback, useEffect, useRef, useState } from "react";
import { sql } from "~/lib/db";
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
    const rows = await sql`
      SELECT content FROM book_content WHERE book_id = ${bookId} LIMIT 1
    `;

    if (rows.length > 0 && rows[0].content) {
      setContent(rows[0].content as JSONContent);
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

      await sql`
        UPDATE book_content
        SET content = ${JSON.stringify(json)}, updated_at = now()
        WHERE book_id = ${bookId}
      `;

      // Also update book's updated_at
      await sql`
        UPDATE books SET updated_at = now() WHERE id = ${bookId}
      `;

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

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "~/hooks/useAuth";
import { sql } from "~/lib/db";

export interface Shelf {
  id: string;
  user_id: string;
  topic_id: string | null;
  name: string;
  position: number;
  created_at: string;
}

export function useShelves(topicId?: string | null) {
  const { user } = useAuth();
  const userId = user?.id;
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  const fetchShelves = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    let rows;
    if (topicId) {
      rows = await sql`
        SELECT * FROM shelves WHERE user_id = ${userId} AND topic_id = ${topicId} ORDER BY position ASC, created_at ASC
      `;
    } else {
      rows = await sql`
        SELECT * FROM shelves WHERE user_id = ${userId} AND topic_id IS NULL ORDER BY position ASC, created_at ASC
      `;
    }
    setShelves(rows as Shelf[]);
    setLoading(false);
    hasFetched.current = true;
  }, [userId, topicId]);

  useEffect(() => {
    fetchShelves();
  }, [fetchShelves]);

  const createShelf = async (name: string) => {
    if (!userId) return;
    const rows = await sql`
      INSERT INTO shelves (name, user_id, topic_id, position)
      VALUES (${name}, ${userId}, ${topicId ?? null}, (
        SELECT COALESCE(MAX(position), -1) + 1 FROM shelves WHERE user_id = ${userId}
      ))
      RETURNING *
    `;
    const shelf = rows[0] as Shelf;
    setShelves((prev) => [...prev, shelf]);
    return shelf;
  };

  const renameShelf = async (id: string, name: string) => {
    const rows = await sql`
      UPDATE shelves SET name = ${name} WHERE id = ${id} RETURNING *
    `;
    const shelf = rows[0] as Shelf;
    setShelves((prev) => prev.map((s) => (s.id === id ? shelf : s)));
    return shelf;
  };

  const deleteShelf = async (id: string) => {
    // Unassign books from this shelf first
    await sql`UPDATE books SET shelf_id = NULL WHERE shelf_id = ${id}`;
    await sql`DELETE FROM shelves WHERE id = ${id}`;
    setShelves((prev) => prev.filter((s) => s.id !== id));
  };

  return { shelves, loading, createShelf, renameShelf, deleteShelf, refetch: fetchShelves };
}

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "~/hooks/useAuth";
import { sql } from "~/lib/db";

export interface Topic {
  id: string;
  user_id: string;
  name: string;
  position: number;
  created_at: string;
}

const ACTIVE_TOPIC_KEY = "active-topic-id";

export function useTopics() {
  const { user } = useAuth();
  const userId = user?.id;
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTopicId, setActiveTopicId] = useState<string | null>(() => {
    return localStorage.getItem(ACTIVE_TOPIC_KEY);
  });
  const hasFetched = useRef(false);

  const fetchTopics = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const rows = await sql`
      SELECT * FROM topics WHERE user_id = ${userId} ORDER BY position ASC, created_at ASC
    `;
    const fetched = rows as Topic[];
    setTopics(fetched);

    // If no active topic or active topic no longer exists, select first
    if (fetched.length > 0) {
      const stored = localStorage.getItem(ACTIVE_TOPIC_KEY);
      if (!stored || !fetched.some((t) => t.id === stored)) {
        setActiveTopicId(fetched[0].id);
        localStorage.setItem(ACTIVE_TOPIC_KEY, fetched[0].id);
      }
    } else {
      setActiveTopicId(null);
      localStorage.removeItem(ACTIVE_TOPIC_KEY);
    }

    setLoading(false);
    hasFetched.current = true;
  }, [userId]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const selectTopic = useCallback((id: string) => {
    setActiveTopicId(id);
    localStorage.setItem(ACTIVE_TOPIC_KEY, id);
  }, []);

  const createTopic = async (name: string) => {
    if (!userId) return;
    const rows = await sql`
      INSERT INTO topics (name, user_id, position)
      VALUES (${name}, ${userId}, (
        SELECT COALESCE(MAX(position), -1) + 1 FROM topics WHERE user_id = ${userId}
      ))
      RETURNING *
    `;
    const topic = rows[0] as Topic;
    setTopics((prev) => [...prev, topic]);
    // Auto-select the new topic
    selectTopic(topic.id);
    return topic;
  };

  const renameTopic = async (id: string, name: string) => {
    const rows = await sql`
      UPDATE topics SET name = ${name} WHERE id = ${id} RETURNING *
    `;
    const topic = rows[0] as Topic;
    setTopics((prev) => prev.map((t) => (t.id === id ? topic : t)));
    return topic;
  };

  const deleteTopic = async (id: string) => {
    // Unassign books and shelves
    await sql`UPDATE books SET topic_id = NULL WHERE topic_id = ${id}`;
    await sql`UPDATE shelves SET topic_id = NULL WHERE topic_id = ${id}`;
    await sql`DELETE FROM topics WHERE id = ${id}`;
    setTopics((prev) => {
      const remaining = prev.filter((t) => t.id !== id);
      if (activeTopicId === id && remaining.length > 0) {
        selectTopic(remaining[0].id);
      } else if (remaining.length === 0) {
        setActiveTopicId(null);
        localStorage.removeItem(ACTIVE_TOPIC_KEY);
      }
      return remaining;
    });
  };

  return {
    topics,
    loading,
    activeTopicId,
    selectTopic,
    createTopic,
    renameTopic,
    deleteTopic,
    refetch: fetchTopics,
  };
}

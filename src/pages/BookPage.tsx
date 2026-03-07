import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "~/lib/supabase";
import { useChapters } from "~/hooks/useChapters";
import { useEditor } from "~/hooks/useEditor";
import type { Chapter } from "~/hooks/useChapters";
import type { Editor } from "@tiptap/react";
import type { JSONContent } from "@tiptap/react";
import BookLayout from "~/components/book-view/BookLayout";
import ChapterSidebar from "~/components/book-view/ChapterSidebar";
import BookEditor from "~/components/book-view/BookEditor";
import Spinner from "~/components/ui/Spinner";

function getH1Titles(doc: JSONContent): string[] {
  const titles: string[] = [];
  const walk = (node: JSONContent) => {
    if (node.type === "heading" && node.attrs?.level === 1) {
      const text = node.content?.map((n) => n.text ?? "").join("").trim();
      if (text) titles.push(text);
    }
    node.content?.forEach(walk);
  };
  walk(doc);
  return titles;
}

export default function BookPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bookTitle, setBookTitle] = useState("");
  const [bookLoading, setBookLoading] = useState(true);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem("sidebar-collapsed") === "true";
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const editorRef = useRef<Editor | null>(null);
  const lastSyncedTitles = useRef<string[]>([]);
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { chapters, addChapter, renameChapter, deleteChapter } = useChapters(id);
  const chaptersRef = useRef<Chapter[]>([]);
  chaptersRef.current = chapters;

  const { content, loading: editorLoading, saveStatus, debouncedSave } = useEditor(id);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await supabase
        .from("books")
        .select("title")
        .eq("id", id)
        .single();
      if (data) setBookTitle(data.title);
      setBookLoading(false);
    })();
  }, [id]);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar-collapsed", String(next));
      return next;
    });
  }, []);

  const handleClickChapter = useCallback((chapter: Chapter) => {
    setActiveChapterId(chapter.id);
    const headings = document.querySelectorAll(".tiptap h1");
    for (const h of headings) {
      if (h.textContent?.trim() === chapter.title.trim()) {
        h.scrollIntoView({ behavior: "smooth", block: "start" });
        break;
      }
    }
  }, []);

  const syncChaptersFromDoc = useCallback(async (doc: JSONContent) => {
    const docTitles = getH1Titles(doc);
    const current = chaptersRef.current;

    if (JSON.stringify(docTitles) === JSON.stringify(lastSyncedTitles.current)) return;
    lastSyncedTitles.current = docTitles;

    const currentTitles = current.map((c) => c.title);

    // Same count, same order — just rename changed positions
    if (docTitles.length === current.length) {
      for (let i = 0; i < docTitles.length; i++) {
        if (current[i].title !== docTitles[i]) {
          await renameChapter(current[i].id, docTitles[i]);
        }
      }
      return;
    }

    // Delete chapters no longer in doc
    for (const ch of current) {
      if (!docTitles.includes(ch.title)) {
        await deleteChapter(ch.id);
      }
    }

    // Add new titles
    for (const title of docTitles) {
      if (!currentTitles.includes(title)) {
        await addChapter(title);
      }
    }
  }, [addChapter, deleteChapter, renameChapter]);

  const handleEditorUpdate = useCallback((json: JSONContent) => {
    debouncedSave(json);
    // Debounce chapter sync — only fires 1.5s after typing stops
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      syncChaptersFromDoc(json);
    }, 1500);
  }, [debouncedSave, syncChaptersFromDoc]);

  if (bookLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-surface">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const effectiveCollapsed = isMobile ? !mobileSidebarOpen : sidebarCollapsed;
  const effectiveToggle = isMobile
    ? () => setMobileSidebarOpen((p) => !p)
    : toggleSidebar;

  return (
    <BookLayout
      bookTitle={bookTitle}
      onBack={() => navigate("/")}
      onToggleMobileSidebar={() => setMobileSidebarOpen((p) => !p)}
      sidebar={
        <ChapterSidebar
          chapters={chapters}
          activeChapterId={activeChapterId}
          collapsed={effectiveCollapsed}
          onToggleCollapse={effectiveToggle}
          onClickChapter={(ch) => {
            handleClickChapter(ch);
            if (isMobile) setMobileSidebarOpen(false);
          }}
          onDeleteChapter={deleteChapter}
        />
      }
      editor={
        <BookEditor
          content={content}
          loading={editorLoading}
          saveStatus={saveStatus}
          onUpdate={handleEditorUpdate}
          onEditorReady={(e) => { editorRef.current = e; }}
        />
      }
    />
  );
}

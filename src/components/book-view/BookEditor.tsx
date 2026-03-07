import { useEditor as useTiptapEditor, EditorContent } from "@tiptap/react";
import type { Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import { useEffect } from "react";
import type { JSONContent } from "@tiptap/react";
import EditorToolbar from "./EditorToolbar";
import Spinner from "~/components/ui/Spinner";

interface BookEditorProps {
  content: JSONContent | null;
  loading: boolean;
  saveStatus: "saved" | "saving" | "idle";
  onUpdate: (json: JSONContent) => void;
  onEditorReady?: (editor: Editor) => void;
}

export default function BookEditor({
  content,
  loading,
  saveStatus,
  onUpdate,
  onEditorReady,
}: BookEditorProps) {
  const editor = useTiptapEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2] },
      }),
      Underline,
      Image,
    ],
    content: content ?? undefined,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: "tiptap focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      onEditorReady?.(editor);
    }
  }, [editor, onEditorReady]);

  useEffect(() => {
    if (editor && content && !editor.isDestroyed) {
      const currentJson = JSON.stringify(editor.getJSON());
      const newJson = JSON.stringify(content);
      if (currentJson !== newJson) {
        editor.commands.setContent(content);
      }
    }
  }, [editor, content]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-surface-warm relative">
      {/* Floating toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1">
        <div className="flex items-center gap-0.5 bg-white rounded-xl shadow-md border border-navy-100 px-2 py-1.5">
          <EditorToolbar editor={editor} />
        </div>
        {saveStatus !== "idle" && (
          <div className="ml-3 text-xs text-text-muted flex items-center gap-1.5 bg-white rounded-xl shadow-md border border-navy-100 px-3 py-2">
            {saveStatus === "saving" && "Saving..."}
            {saveStatus === "saved" && (
              <>
                <svg className="w-3.5 h-3.5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Saved
              </>
            )}
          </div>
        )}
      </div>
      {/* Content */}
      <div
        className="flex-1 overflow-y-auto cursor-text pt-16"
        onClick={() => editor?.commands.focus()}
      >
        <div className="max-w-7xl mx-auto px-6 py-8 min-h-full">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}

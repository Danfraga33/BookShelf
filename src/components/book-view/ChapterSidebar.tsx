import { useState } from "react";
import type { Chapter } from "~/hooks/useChapters";
import DeleteConfirmModal from "~/components/books/DeleteConfirmModal";

interface ChapterSidebarProps {
  chapters: Chapter[];
  subheadings: Record<string, string[]>;
  activeChapterId: string | null;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onClickChapter: (chapter: Chapter) => void;
  onClickSubheading: (title: string) => void;
  onDeleteChapter: (id: string) => Promise<unknown>;
}

export default function ChapterSidebar({
  chapters,
  subheadings,
  activeChapterId,
  collapsed,
  onToggleCollapse,
  onClickChapter,
  onClickSubheading,
  onDeleteChapter,
}: ChapterSidebarProps) {
  const [deleteTarget, setDeleteTarget] = useState<Chapter | null>(null);

  if (collapsed) {
    return (
      <div className="w-12 bg-white border-r border-navy-100 hidden md:flex flex-col items-center pt-3 shrink-0">
        <button
          onClick={onToggleCollapse}
          className="p-2 text-navy-400 hover:bg-surface rounded-lg transition-colors duration-200"
          title="Expand sidebar"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    );
  }

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between px-4 py-3 border-b border-navy-100">
        <div>
          <span className="text-sm font-semibold text-text-primary block">
            Table of Contents
          </span>
          <span className="text-xs text-text-muted">
            {chapters.length} Chapter{chapters.length !== 1 ? "s" : ""}
          </span>
        </div>
        <button
          onClick={onToggleCollapse}
          className="cursor-pointer p-1.5 text-navy-400 hover:text-navy-600 hover:bg-surface rounded-lg transition-colors duration-200"
          title="Collapse sidebar"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7M18 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-2 px-2">
        {chapters.length === 0 && (
          <p className="text-text-muted text-xs px-2 py-4 text-center">
            Type an H1 heading in the editor to create a chapter.
          </p>
        )}

        {chapters.map((chapter) => (
          <div key={chapter.id}>

            <div className="group relative">
              <button
                onClick={() => onClickChapter(chapter)}
                className={`cursor-pointer w-full text-left px-3 py-2.5 text-base rounded-lg transition-all duration-200 flex items-center gap-2.5 ${
                  activeChapterId === chapter.id
                    ? "bg-primary text-white font-medium"
                    : "text-text-secondary hover:bg-surface hover:text-text-primary"
                }`}
              >
                <svg className="w-5 h-5 shrink-0 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="truncate">{chapter.title}</span>
              </button>
              <div className="absolute right-1 top-1/2 -translate-y-1/2 hidden group-hover:flex">
                <button
                  onClick={() => setDeleteTarget(chapter)}
                  className="cursor-pointer p-1 text-navy-300 hover:text-danger rounded transition-colors duration-200"
                  title="Delete chapter"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* H2 subheadings indented below */}
            {(subheadings[chapter.title] ?? []).map((sub) => (
              <button
                key={sub}
                onClick={() => onClickSubheading(sub)}
                className="cursor-pointer w-full text-left pl-10 pr-3 py-1.5 text-sm rounded-lg transition-all duration-200 text-text-muted hover:bg-surface hover:text-text-primary truncate flex items-center gap-2"
              >
                <span className="w-1 h-1 rounded-full bg-navy-300 shrink-0" />
                <span className="truncate">{sub}</span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex w-96 bg-white border-r border-navy-100 flex-col shrink-0 h-full">
        {sidebarContent}
      </div>

      {/* Mobile drawer overlay */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          collapsed ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <div className="absolute inset-0 bg-black/40" onClick={onToggleCollapse} />
        <div
          className={`absolute left-0 top-0 bottom-0 w-72 bg-white flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-xl ${
            collapsed ? "-translate-x-full" : "translate-x-0"
          }`}
        >
          {sidebarContent}
        </div>
      </div>

      <DeleteConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) await onDeleteChapter(deleteTarget.id);
        }}
        itemName={deleteTarget?.title ?? ""}
        itemType="chapter"
      />
    </>
  );
}

import type { ReactNode } from "react";

interface BookLayoutProps {
  sidebar: ReactNode;
  editor: ReactNode;
  bookTitle: string;
  onBack: () => void;
  onToggleMobileSidebar?: () => void;
}

export default function BookLayout({
  sidebar,
  editor,
  bookTitle,
  onBack,
  onToggleMobileSidebar,
}: BookLayoutProps) {
  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Top bar */}
      <div className="bg-white border-b border-navy-100 px-4 py-2.5 flex items-center gap-3 shrink-0">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="cursor-pointer md:hidden p-1.5 hover:bg-surface rounded-lg transition-colors duration-200 text-navy-400"
            title="Open chapters"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <button
          onClick={onBack}
          className="cursor-pointer p-1.5 hover:bg-surface rounded-lg transition-colors duration-200 text-navy-400"
          title="Back to dashboard"
        >
          <svg className="w-5 h-5"  fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" style={{ color: "#1a2533" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h1 className="cursor-default font-heading font-bold text-text-primary truncate">
            {bookTitle}
          </h1>
        </div>
      </div>

      {/* Main area */}
      <div className="flex flex-1 min-h-0">
        {sidebar}
        {editor}
      </div>
    </div>
  );
}

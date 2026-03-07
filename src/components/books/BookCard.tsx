import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Book } from "~/hooks/useBooks";

const COVER_COLORS = [
  { bg: "bg-cover-sage",  spine: "bg-[#7d9194]" },
  { bg: "bg-cover-mauve", spine: "bg-[#8a7278]" },
  { bg: "bg-cover-dusty", spine: "bg-[#6f7d8a]" },
  { bg: "bg-cover-plum",  spine: "bg-[#5f5d72]" },
  { bg: "bg-cover-navy",  spine: "bg-[#2c3d4f]" },
];

function getCoverColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COVER_COLORS[Math.abs(hash) % COVER_COLORS.length];
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
}

export default function BookCard({ book, onEdit, onDelete }: BookCardProps) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const cover = getCoverColor(book.id);

  return (
    <div
      className="group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Book cover — tall portrait ratio */}
      <div
        className="relative w-full cursor-pointer"
        style={{ paddingBottom: "133%" }}
        onClick={() => navigate(`/book/${book.id}`)}
      >
        <div className={`absolute inset-0 rounded-lg ${cover.bg} transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg`}>
          {/* Spine shadow on left edge */}
          <div className={`absolute left-0 top-0 bottom-0 w-2 rounded-l-lg ${cover.spine} opacity-60`} />
          {/* Subtle inner highlight */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/10 to-transparent" />

          {/* Hover action buttons */}
          {hovered && (
            <div className=" absolute top-2 right-2 flex gap-1 animate-fade-in">
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(book); }}
                className="cursor-pointer p-1.5 bg-white/90 backdrop-blur-sm rounded-md hover:bg-white text-navy-500 hover:text-navy-800 transition-colors duration-200"
                title="Edit"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(book); }}
                className="cursor-pointer p-1.5 bg-white/90 backdrop-blur-sm rounded-md hover:bg-white text-navy-500 hover:text-danger transition-colors duration-200"
                title="Delete"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Book info below cover */}
      <div className="mt-3">
        <h3 className="font-display font-semibold text-lg text-text-primary truncate leading-snug">
          {book.title}
        </h3>
        {book.description && (
          <p className="font-display text-md text-text-secondary mt-0.5 truncate">
            {book.description}
          </p>
        )}
        <p className="font-display text-sm text-text-muted mt-1 flex items-center gap-1">
          <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Updated {timeAgo(book.updated_at)}
        </p>
      </div>
    </div>
  );
}

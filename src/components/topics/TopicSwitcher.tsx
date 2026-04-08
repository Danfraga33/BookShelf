import { useState, useRef, useEffect } from "react";
import type { Topic } from "~/hooks/useTopics";

interface TopicSwitcherProps {
  topics: Topic[];
  activeTopicId: string | null;
  onSelect: (id: string) => void;
  onCreate: (name: string) => Promise<unknown>;
  onRename: (id: string, name: string) => Promise<unknown>;
  onDelete: (id: string) => Promise<unknown>;
}

export default function TopicSwitcher({
  topics,
  activeTopicId,
  onSelect,
  onCreate,
  onRename,
  onDelete,
}: TopicSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const createInputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const activeTopic = topics.find((t) => t.id === activeTopicId);

  useEffect(() => {
    if (creating) createInputRef.current?.focus();
  }, [creating]);

  useEffect(() => {
    if (editingId) editInputRef.current?.focus();
  }, [editingId]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        setCreating(false);
        setEditingId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleCreate = async () => {
    const trimmed = newName.trim();
    if (trimmed) {
      await onCreate(trimmed);
    }
    setNewName("");
    setCreating(false);
  };

  const handleRename = async () => {
    if (!editingId) return;
    const trimmed = editName.trim();
    if (trimmed && trimmed !== topics.find((t) => t.id === editingId)?.name) {
      await onRename(editingId, trimmed);
    }
    setEditingId(null);
    setEditName("");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-surface transition-colors duration-200 text-text-primary"
      >
        <svg className="w-4 h-4 text-navy-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
        <span className="font-display font-semibold text-sm truncate max-w-[150px]">
          {activeTopic?.name ?? "No Topic"}
        </span>
        <svg className={`w-3.5 h-3.5 text-navy-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-lg border border-navy-100 py-1 z-50 animate-fade-in">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className={`group/item flex items-center justify-between px-3 py-2 hover:bg-surface transition-colors duration-200 ${
                topic.id === activeTopicId ? "bg-primary-light/50" : ""
              }`}
            >
              {editingId === topic.id ? (
                <input
                  ref={editInputRef}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={handleRename}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRename();
                    if (e.key === "Escape") { setEditingId(null); setEditName(""); }
                  }}
                  className="flex-1 text-sm font-medium text-text-primary bg-transparent border-b-2 border-primary outline-none px-1 py-0"
                />
              ) : (
                <button
                  onClick={() => { onSelect(topic.id); setOpen(false); }}
                  className="cursor-pointer flex-1 text-left text-sm font-medium text-text-primary truncate"
                >
                  {topic.name}
                </button>
              )}

              <div className="flex items-center gap-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 shrink-0 ml-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingId(topic.id);
                    setEditName(topic.name);
                  }}
                  className="cursor-pointer p-1 text-navy-400 hover:text-navy-800 rounded transition-colors"
                  title="Rename"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(topic.id);
                    if (topics.length <= 1) setOpen(false);
                  }}
                  className="cursor-pointer p-1 text-navy-400 hover:text-danger rounded transition-colors"
                  title="Delete"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          {/* Divider */}
          {topics.length > 0 && <div className="h-px bg-navy-100 my-1" />}

          {/* Create new topic */}
          {creating ? (
            <div className="px-3 py-2">
              <input
                ref={createInputRef}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={handleCreate}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreate();
                  if (e.key === "Escape") { setCreating(false); setNewName(""); }
                }}
                placeholder="Topic name..."
                className="w-full text-sm text-text-primary bg-transparent border-b-2 border-primary outline-none px-1 py-0"
              />
            </div>
          ) : (
            <button
              onClick={() => setCreating(true)}
              className="cursor-pointer w-full text-left px-3 py-2 text-sm text-primary font-medium hover:bg-surface transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Topic
            </button>
          )}
        </div>
      )}
    </div>
  );
}

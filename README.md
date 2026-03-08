# Bookshelf — Note-Taking SaaS

A modern book-style note-taking application that lets you organize your thoughts into structured "books" with chapters and rich-text content.

## Features

- **Dashboard** — Browse, create, edit, and delete your book collection
- **Rich Text Editor** — Write with bold, italic, underline, headings, lists, and images using TipTap
- **Chapter Organization** — Structure each book into chapters that anchor within a single continuous document
- **Auto-Save** — Changes save automatically as you type (debounced)
- **Authentication** — Sign up and log in with email/password or Google OAuth
- **User-Scoped Data** — All books and notes are private to your account via Supabase Row Level Security

## Tech Stack

- **Frontend** — React + React Router (SPA)
- **Editor** — TipTap (rich-text editing)
- **Backend & Database** — Supabase (Postgres)
- **Authentication** — Supabase Auth (Email/Password + Google OAuth)

## Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd playbook

# Install dependencies
npm install
```

### Environment Setup

Create a `.env.local` file in the project root:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from your Supabase project settings.

### Running the Dev Server

```bash
npm run dev
```

The app will open at `http://localhost:5173` (or another port if 5173 is in use).

## Project Structure

```
src/
├── components/
│   ├── books/          # BookCard, BookGrid, BookForm, DeleteConfirmModal
│   ├── book-view/      # BookLayout, ChapterSidebar, BookEditor
│   └── ui/             # Shared UI primitives (Button, Modal, Input, etc.)
├── pages/
│   ├── DashboardPage   # Books management view
│   ├── BookPage        # Single book view (sidebar + editor)
│   └── AuthPage        # Login / signup
├── hooks/              # Custom React hooks (useBooks, useChapters, useEditor)
├── lib/
│   └── supabase.ts     # Supabase client initialization
└── routes/             # React Router route definitions
```

## Core Workflows

### Creating a Book

1. Click **New Book** on the Dashboard
2. Enter a title and optional description
3. The book appears in your grid immediately
4. Click it to open and start editing

### Writing & Editing

1. Open a book from the Dashboard
2. Add chapters from the left sidebar
3. Click a chapter to scroll to its section in the editor
4. Type or format content using the rich-text toolbar
5. Changes save automatically — no manual save needed

### Managing Chapters

- **Add** — Click the "+" button in the sidebar
- **Rename** — Click a chapter name to edit it
- **Delete** — Click the delete icon (requires confirmation)
- **Reorder** — Drag chapters to rearrange (if supported)

### Deleting a Book

1. Click the delete icon on a book card
2. Confirm deletion in the modal
3. The book and all its content are permanently removed

## Authentication

- **Email/Password** — Create an account or log in with credentials
- **Google OAuth** — Sign in with your Google account
- **Protected Routes** — Unauthenticated users are redirected to the auth page
- **Automatic Logout** — Sessions can be managed in account settings

## Data Model

### Books

Each book contains:
- `id` — Unique identifier
- `title` — Book name
- `description` — Short summary or notes
- `created_at` — Creation timestamp
- `updated_at` — Last modified timestamp

### Chapters

Chapters are sections within a book:
- `id` — Unique identifier
- `title` — Chapter name
- `position` — Order within the book
- `created_at` — Creation timestamp

Chapters are rendered as anchor headings in the editor, allowing quick navigation from the sidebar.

### Book Content

The rich-text document for each book:
- `id` — Unique identifier
- `content` — TipTap JSON document (headings, paragraphs, lists, images, etc.)
- `updated_at` — Last modified timestamp

## Security & Privacy

- **Row Level Security (RLS)** — Supabase enforces that users only see their own books
- **User-Scoped Queries** — All database queries filter by authenticated user ID
- **No Shared Access** — Books are private by default (no sharing or collaboration features yet)

## Development

### Available Commands

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run linter (if configured)
```

### Database Setup

Supabase tables are defined in `CLAUDE.md`. To initialize the schema:

1. Log into your Supabase project dashboard
2. Go to SQL Editor
3. Create the tables and RLS policies as documented

(A migration script or seed file may be added in the future.)

## Contributing

Contributions are welcome. Please:

1. Create a feature branch (`git checkout -b feature/my-feature`)
2. Commit changes with clear messages
3. Push to your fork and submit a pull request

## License

(Add your license here, e.g., MIT, Apache 2.0, etc.)

## Support

For issues or questions:
- Check existing GitHub issues
- Open a new issue with a clear description
- Contact the maintainers

## Roadmap

Potential future features:
- Chapter reordering (drag & drop)
- Book sharing and collaboration
- Export to PDF or Markdown
- Search within books
- Tags and organization
- Dark mode
- Mobile app

---

**Built with ❤️ using React, TipTap, and Supabase.**

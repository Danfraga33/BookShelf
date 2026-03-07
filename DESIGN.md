# DESIGN.md — Bookshelf App Design System

Extracted from Stitch MCP mockups (Project ID: 3800672440917227473).
Screenshots saved in `/design-mockups/`.

## Design Philosophy

The app should feel like a real book — warm, focused, and distraction-free. The dashboard feels like a bookshelf. The book view feels like opening a physical book. Every interaction should be intentional and calm.

---

## Color Palette

### Primary
| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#1152d4` | Buttons, links, active states, CTA |
| `primary-hover` | `#0e44b0` | Button hover state |
| `primary-light` | `#e8eefb` | Light primary backgrounds, badges |

### Neutrals — Navy Scale
| Token | Hex | Usage |
|-------|-----|-------|
| `navy-900` | `#101622` | Darkest background (dark mode) |
| `navy-800` | `#1a2530` | Sidebar background, dark panels |
| `navy-700` | `#243040` | Sidebar hover, secondary dark |
| `navy-600` | `#2d3a4a` | Dark borders, muted elements |
| `navy-500` | `#4a5568` | Secondary text |
| `navy-400` | `#6b7a8d` | Placeholder text, muted icons |
| `navy-300` | `#94a3b8` | Disabled text, subtle borders |
| `navy-200` | `#cbd5e1` | Light borders |
| `navy-100` | `#e2e8f0` | Dividers, input borders |

### Surface / Background
| Token | Hex | Usage |
|-------|-----|-------|
| `surface` | `#f6f6f8` | Page background (dashboard, auth) |
| `surface-warm` | `#fdfbf7` | Editor paper background |
| `white` | `#ffffff` | Cards, modals, input backgrounds |

### Text
| Token | Hex | Usage |
|-------|-----|-------|
| `text-primary` | `#1a2530` | Headings, primary text |
| `text-secondary` | `#4a5568` | Descriptions, secondary content |
| `text-muted` | `#6b7a8d` | Timestamps, placeholders |
| `text-on-dark` | `#ffffff` | Text on dark/primary backgrounds |
| `text-on-sidebar` | `#cbd5e1` | Sidebar text on navy background |

### Book Cover Palette (decorative card colors)
| Token | Hex | Usage |
|-------|-----|-------|
| `cover-sage` | `#9aacb0` | Book cover variant |
| `cover-mauve` | `#a8929a` | Book cover variant |
| `cover-dusty` | `#8c9baa` | Book cover variant |
| `cover-plum` | `#7a7890` | Book cover variant |
| `cover-navy` | `#3d4f63` | Book cover variant |

### Semantic
| Token | Hex | Usage |
|-------|-----|-------|
| `danger` | `#dc2626` | Delete buttons, error states |
| `danger-hover` | `#b91c1c` | Delete hover |
| `success` | `#16a34a` | Success indicators |
| `warning` | `#f59e0b` | Warning states |

---

## Typography

### Font Families
| Token | Family | Usage |
|-------|--------|-------|
| `font-display` | `'Newsreader', Georgia, serif` | Editor headings, chapter titles in document |
| `font-sans` | `'Inter', system-ui, sans-serif` | UI text, buttons, labels, navigation |
| `font-heading` | `'Manrope', 'Inter', sans-serif` | Page headings (dashboard title, auth heading) |

### Font Sizes
| Token | Size | Line Height | Usage |
|-------|------|-------------|-------|
| `text-xs` | `0.75rem` (12px) | 1rem | Timestamps, badges |
| `text-sm` | `0.875rem` (14px) | 1.25rem | Secondary text, descriptions |
| `text-base` | `1rem` (16px) | 1.5rem | Body text, inputs, buttons |
| `text-lg` | `1.125rem` (18px) | 1.75rem | Subheadings, sidebar titles |
| `text-xl` | `1.25rem` (20px) | 1.75rem | Section headings |
| `text-2xl` | `1.5rem` (24px) | 2rem | Page titles ("My Books") |
| `text-3xl` | `1.875rem` (30px) | 2.25rem | Auth heading ("Welcome Back") |
| `text-4xl` | `2.25rem` (36px) | 2.5rem | Chapter headings in editor |

### Font Weights
| Token | Weight | Usage |
|-------|--------|-------|
| `font-normal` | 400 | Body text, descriptions |
| `font-medium` | 500 | Labels, navigation items |
| `font-semibold` | 600 | Buttons, card titles |
| `font-bold` | 700 | Page headings, chapter headings |

---

## Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | `0.25rem` (4px) | Tight gaps |
| `space-2` | `0.5rem` (8px) | Icon gaps, small padding |
| `space-3` | `0.75rem` (12px) | Input padding-x, compact card padding |
| `space-4` | `1rem` (16px) | Standard padding, card gap |
| `space-5` | `1.25rem` (20px) | Section gap |
| `space-6` | `1.5rem` (24px) | Card padding, sidebar padding |
| `space-8` | `2rem` (32px) | Section spacing |
| `space-10` | `2.5rem` (40px) | Page padding-x |
| `space-12` | `3rem` (48px) | Large section spacing |
| `space-16` | `4rem` (64px) | Page top/bottom padding |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-sm` | `0.25rem` (4px) | Subtle rounding (tags) |
| `rounded` | `0.5rem` (8px) | Inputs, small cards |
| `rounded-lg` | `0.75rem` (12px) | Cards, modals, book covers |
| `rounded-xl` | `1rem` (16px) | Large cards, illustration panels |
| `rounded-full` | `9999px` | Avatars, badges, pills |

---

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Inputs, small elements |
| `shadow` | `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)` | Cards at rest |
| `shadow-md` | `0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)` | Card hover, dropdowns |
| `shadow-lg` | `0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)` | Modals, floating panels |
| `shadow-xl` | `0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)` | Modal overlay |

---

## Component Patterns

### Buttons
- **Primary**: `bg-primary text-white font-semibold rounded-lg px-5 py-2.5 shadow-sm hover:bg-primary-hover transition-colors`
- **Secondary/Outline**: `border border-navy-200 text-navy-800 rounded-lg px-4 py-2 hover:bg-surface`
- **Danger**: `bg-danger text-white rounded-lg px-4 py-2 hover:bg-danger-hover`
- **Ghost**: `text-navy-500 hover:text-navy-800 hover:bg-navy-100 rounded-lg px-3 py-1.5`

### Inputs
- **Text Input**: `bg-white border border-navy-100 rounded-lg px-3 py-2.5 text-base text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary-light`
- **Textarea**: Same as input, min-height 100px

### Cards (Book Cards)
- `bg-white rounded-lg shadow hover:shadow-md transition-shadow`
- Cover area: `h-40 rounded-t-lg` with decorative cover color
- Content padding: `p-4`
- Title: `font-semibold text-text-primary`
- Description: `text-sm text-text-secondary`
- Timestamp: `text-xs text-text-muted`

### Modal
- Overlay: `bg-black/50 backdrop-blur-sm`
- Panel: `bg-white rounded-xl shadow-xl max-w-md mx-auto p-6`
- Title: `text-xl font-bold text-text-primary`
- Actions: right-aligned, Cancel (secondary) + Confirm (primary)

### Sidebar (Book View)
- Width: `260px`
- Background: `bg-navy-800`
- Chapter items: `px-4 py-2 text-text-on-sidebar text-sm rounded-lg`
- Active item: `bg-white text-navy-800 font-medium`
- Add button: `text-text-on-sidebar hover:bg-navy-700`

### Editor Area
- Background: `bg-surface-warm`
- Content area: `max-w-3xl mx-auto` with generous padding
- Chapter heading: `font-display text-4xl font-bold text-text-primary`
- Body text: `font-sans text-base leading-relaxed text-text-primary`
- Blockquote: `border-l-4 border-navy-200 pl-4 italic text-text-secondary`

### Toolbar
- `bg-white border-b border-navy-100 px-4 py-2`
- Tool buttons: `p-2 rounded hover:bg-surface text-navy-500 hover:text-navy-800`
- Active tool: `bg-primary-light text-primary`

### Header (Dashboard)
- `bg-white border-b border-navy-100 px-6 py-3`
- Logo: `font-heading font-bold text-lg text-text-primary`
- User avatar: `w-8 h-8 rounded-full`

---

## Layout Architecture

### 1. Dashboard — Bookshelf View
- Responsive card grid (3 cols -> 2 -> 1 on smaller screens)
- Each card is clickable to open the book
- Edit / Delete actions are icon buttons on the card (visible on hover)
- "New Book" opens a modal with title + description fields

### 2. Book View — Reading/Writing Mode
- Left sidebar: fixed width (260px) when expanded, collapses to 48px rail
- Collapse toggle button at top of sidebar
- Right panel expands to fill remaining width when sidebar is collapsed
- Collapsed state remembered per session (localStorage)
- Active chapter highlighted in sidebar as user scrolls (scroll spy)
- Clicking a chapter smoothly scrolls to that anchor in the document
- Editor max-width: 720px centered in the right panel

---

## Interaction Design

### Creating a Book
1. Click "+ New Book"
2. Modal opens with Title (required) and Description (optional) fields
3. Submit -> book appears in grid, modal closes

### Deleting a Book
1. Click delete icon on book card
2. Confirmation modal: "Delete '[Book Title]'? This cannot be undone."
3. Two buttons: "Cancel" and "Delete" (destructive, red)
4. Confirm -> book removed from grid

### Adding a Chapter
1. Click "+ Add Chapter" in sidebar
2. Inline input appears at bottom of chapter list
3. Type chapter name -> press Enter to confirm
4. Chapter heading inserted at end of document, sidebar updates

### Collapsing / Expanding the Sidebar
1. Click collapse button at the top of the sidebar
2. Sidebar animates to a 48px rail
3. Expand button remains visible on the rail
4. Editor panel smoothly expands to fill the space
5. State persisted in localStorage

### Clicking a Chapter
1. Click chapter name in sidebar
2. Document smoothly scrolls to that heading anchor
3. Chapter becomes "active" in sidebar (highlighted)

### Auto-Save
- TipTap onChange triggers a debounced save (1.5s delay)
- Subtle "Saving..." / "Saved" indicator in top-right of editor panel
- No manual save button

---

## Responsive Behavior

| Breakpoint | Behavior |
|------------|---------|
| Desktop (>1024px) | Full two-panel layout |
| Tablet (768-1024px) | Sidebar collapses to icon/toggle drawer |
| Mobile (<768px) | Sidebar hidden, accessible via hamburger menu |

---

## Auth Flow

```
/ (root)
  -> if authenticated -> /dashboard
  -> if not -> /auth

/auth
  -> Email/password form
  -> "Continue with Google" button
  -> On success -> /dashboard

/dashboard
  -> Protected route
  -> Lists user's books

/book/:id
  -> Protected route
  -> Opens book view for that book ID
```

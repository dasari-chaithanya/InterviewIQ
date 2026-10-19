# InterviewIQ Design System Specification

## Section 1 — Design Principles
**Product Philosophy:** InterviewIQ is built to provide an uninterrupted, high-focus environment for candidates preparing for crucial career moments.
**UX Principles:** 
- **Clarity over cleverness:** Actions should be immediately obvious.
- **Progressive disclosure:** Reveal advanced features only when necessary.
- **Premium simplicity:** A distraction-free, elegant interface that feels native to modern operating systems.
**Visual Hierarchy:** Clean, top-down reading flow. High contrast for primary actions, subtle muting for secondary elements. Prefer whitespace over explicit borders.
**Information Hierarchy:** Content is king. The interface fades away, highlighting the user's progress and the interview material.
**Accessibility Philosophy:** Accessibility is not an afterthought. The platform must be fully usable via keyboard and screen reader, with strict contrast compliance.
**Consistency Rules:** Predictable patterns. A button acts like a button everywhere.
**Responsive Philosophy:** Fluid layouts that feel native on mobile, tablet, and wide desktop screens.
**Motion Philosophy:** Meaningful, subtle, and fast. Motion should assist context, not distract. No bouncy or playful animations.

---

## Section 2 — Design Tokens

### Colors
**Light Theme:**
- `--background`: `#FAFAFA`
- `--foreground`: `#111827`
- `--card`: `#FFFFFF`
- `--card-foreground`: `#111827`
- `--popover`: `#FFFFFF`
- `--popover-foreground`: `#111827`
- `--primary`: `#2563EB`
- `--primary-foreground`: `#FFFFFF`
- `--secondary`: `#F3F4F6`
- `--secondary-foreground`: `#111827`
- `--muted`: `#F3F4F6`
- `--muted-foreground`: `#6B7280`
- `--accent`: `#2563EB`
- `--accent-foreground`: `#FFFFFF`
- `--destructive`: `#DC2626`
- `--destructive-foreground`: `#FFFFFF`
- `--success`: `#16A34A`
- `--success-foreground`: `#FFFFFF`
- `--warning`: `#F59E0B`
- `--warning-foreground`: `#FFFFFF`
- `--info`: `#3B82F6`
- `--info-foreground`: `#FFFFFF`
- `--border`: `#E5E7EB`
- `--input`: `#E5E7EB`
- `--ring`: `#2563EB`
- `--overlay`: `rgba(17, 24, 39, 0.4)`

**Dark Theme:**
- `--background`: `#09090B`
- `--foreground`: `#FAFAFA`
- `--card`: `#18181B`
- `--card-foreground`: `#FAFAFA`
- `--popover`: `#18181B`
- `--popover-foreground`: `#FAFAFA`
- `--primary`: `#3B82F6`
- `--primary-foreground`: `#FFFFFF`
- `--secondary`: `#27272A`
- `--secondary-foreground`: `#FAFAFA`
- `--muted`: `#27272A`
- `--muted-foreground`: `#A1A1AA`
- `--accent`: `#3B82F6`
- `--accent-foreground`: `#FFFFFF`
- `--destructive`: `#EF4444`
- `--destructive-foreground`: `#FFFFFF`
- `--success`: `#16A34A`
- `--success-foreground`: `#FFFFFF`
- `--warning`: `#F59E0B`
- `--warning-foreground`: `#FFFFFF`
- `--info`: `#3B82F6`
- `--info-foreground`: `#FFFFFF`
- `--border`: `#27272A`
- `--input`: `#27272A`
- `--ring`: `#3B82F6`
- `--overlay`: `rgba(9, 9, 11, 0.8)`

### Typography (Inter)
- **Display:** 48px, SemiBold (600), Line Height: 1.1, Tracking: -0.02em
- **Heading 1:** 36px, SemiBold (600), Line Height: 1.2, Tracking: -0.02em
- **Heading 2:** 24px, SemiBold (600), Line Height: 1.3, Tracking: -0.01em
- **Subheading:** 20px, Medium (500), Line Height: 1.4, Tracking: -0.01em
- **Body Large:** 16px, Regular (400), Line Height: 1.5, Tracking: 0em
- **Body Small:** 14px, Regular (400), Line Height: 1.5, Tracking: 0em
- **Caption:** 12px, Regular (400), Line Height: 1.4, Tracking: 0.01em
- **Label:** 14px, Medium (500), Line Height: 1.4, Tracking: 0.01em
- **Button:** 14px, Medium (500), Line Height: 1, Tracking: 0.01em
- **Code:** 14px, Fira Code/JetBrains Mono, Regular (400), Line Height: 1.5

### Spacing (4px Grid)
- **Spacing-1:** 4px
- **Spacing-2:** 8px
- **Spacing-3:** 12px
- **Spacing-4:** 16px
- **Spacing-6:** 24px
- **Spacing-8:** 32px
- **Spacing-12:** 48px
- **Spacing-16:** 64px
- **Section Spacing:** 64px or 96px
- **Container Padding:** 24px (Mobile: 16px)
- **Card Padding:** 24px

### Border Radius
- **xs:** 2px
- **sm:** 4px
- **md:** 6px
- **lg:** 8px
- **xl:** 12px
- **2xl:** 16px
- **full:** 9999px

### Shadows
- **Card (Light):** `0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)`
- **Hover:** `0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)`
- **Dropdown/Modal:** `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)`
- **Tooltip:** `0 4px 6px -1px rgba(0, 0, 0, 0.1)`
- **Dark Mode Shadows:** Rendered mostly as subtle glowing borders (`#27272A`) or deep ambient overlays, avoiding traditional drop shadows on dark backgrounds.

### Motion
- **Durations:** 
  - Fast: 120ms (Hover)
  - Medium: 250ms (Page transitions, Toasts)
  - Slow: 300ms (Sidebar, Modals, Drawers)
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (Linear/Apple Spring feel)

---

## Section 3 — Iconography
**Library:** Lucide React (Exclusively).
**Rules:**
- Default size: `16px` (UI elements), `20px` (Headers), `24px` (Empty states/Display).
- Stroke width: `2px` for normal sizes, `1.5px` for Display.
- Icons should never be mixed with other libraries to maintain consistent stroke caps and corners.

---

## Section 4 — Layout System
- **Maximum Content Width:** `1440px`.
- **Dashboard Grid:** 12-column CSS Grid. Gap: `24px`.
- **Sidebar:** Expanded: `272px`. Collapsed: `72px`.
- **Navbar Height:** `64px`.
- **Page Spacing:** `24px` margins from Sidebar.
- **Section Spacing:** `48px` vertically between major layout rows.

---

## Section 5 — Responsive System
- **Mobile:** `0 - 639px` (1 column grid, Sidebar hidden/bottom-nav).
- **Tablet:** `640 - 1023px` (Sidebar collapsed, 2-6 column grids).
- **Laptop:** `1024 - 1279px` (Sidebar expanded, 12 column grids).
- **Desktop:** `1280 - 1535px` (Standard workspace).
- **Wide:** `1536px+` (Max-width centered content).

---

## Section 6 — Component Specifications

### Button
- **Purpose:** Primary interaction element.
- **Variants:** Primary, Secondary, Outline, Ghost, Destructive, Success.
- **Sizes:** xs (h-7), sm (h-8), md (h-9), lg (h-10), icon (h-9 w-9).
- **States:** Loading (spinner replaces icon), Disabled (opacity-50, pointer-events-none), Hover (scale-98, color shift), Focus (ring-2 with offset).

### Card
- **Purpose:** Content container.
- **Anatomy:** Header, Title, Description, Content, Footer.
- **Variants:** Default, Elevated (shadow), Interactive (hover state), Analytics (no padding variant), Dashboard.

### Input / Textarea
- **Anatomy:** Label, Input field, Left/Right Icon, Helper Text, Error Message.
- **States:** Default (border muted), Focus (ring primary), Error (ring destructive), Success (ring success), Disabled (muted background).

*(Note: Detailed specs apply similarly to Select, Checkbox, Switch, Badge, Avatar, Table, Modal, Dialog, Drawer, Dropdown, Tabs, Accordion, Tooltip, Toast, Breadcrumb, Progress, Skeleton, Pagination, Search Bar, Command Palette, Charts).*

**Guidelines:** 
- No arbitrary widths. Use 100% of container or intrinsic sizing.
- Tooltips on all icon-only buttons.
- Tables must have horizontal scroll on mobile.

---

## Section 7 — Navigation System
- **Sidebar:** Persistent left navigation. Contains: Logo (top), Workspace links, Settings, User Profile (bottom). Smooth width transition (300ms) when collapsing.
- **Navbar:** Sticky top bar. Height `64px`. Contains: Breadcrumb, Command Palette Trigger (Cmd+K), Theme Toggle, Notifications.
- **Mobile Navigation:** Sidebar becomes a sliding Drawer. 

---

## Section 8 — Data Display
- **Statistics Cards:** Label top-left, Value large, Trend indicator (up/down arrow with Success/Destructive colors).
- **Tables:** Minimal borders. Hover effect on rows. Pagination at bottom right.
- **Charts:** Minimal axes. Use primary/secondary brand colors for bars/lines. No gridlines unless necessary. Use Tooltips on hover.

---

## Section 9 — Forms
- **Validation:** On blur and on submit.
- **Labels:** Always present, never rely solely on placeholders.
- **Required Indicators:** Subtle asterisk or "Optional" text (preferred).
- **Spacing:** `16px` between form groups.

---

## Section 10 — Feedback System
- **Loading:** Use Skeletons representing the exact shape of incoming data. Spinners only inside buttons or isolated small contexts.
- **Empty States:** Highly polished illustrations or centralized icon + Headline + Subtext + Primary CTA.
- **Toasts:** Slide in from bottom-right. Disappear after 4000ms. Keep text short.

---

## Section 11 — Motion Guidelines
- **Page Transitions:** Fade in (`opacity 0 -> 1`), slight upward slide (`translateY 10px -> 0`). Duration 250ms.
- **Card Hover:** `scale 1.02`, shadow expands.
- **Modals/Dialogs:** Spring animation (feels physical, slightly bounces into place).
- **Dropdowns:** Quick fade in and slight scale down.

---

## Section 12 — Accessibility
- **Focus:** Every interactive element must have a visible focus ring (2px solid primary with 2px offset).
- **ARIA:** All modals must trap focus. All icon buttons must have `aria-label`.
- **Contrast:** Minimum 4.5:1 ratio for text.
- **Motion:** Respect `prefers-reduced-motion` media queries by disabling transforms and shortening durations to 0ms.

---

## Section 13 — Theme System
- **Strict adherence:** Never use specific color codes (e.g., `text-gray-900`) in markup. Always use semantic tokens (e.g., `text-foreground`).
- Toggle available globally via Navbar or Command Palette.
- Persisted in localStorage and system-sync enabled.

---

## Section 14 — Folder Organization
```
docs/               <- Architecture & Design Docs
src/
 ├── app/           <- Next.js Pages
 ├── components/    <- Reusable UI
 │    ├── ui/       <- Base Primitives
 │    ├── layout/   <- Sidebar, Navbar
 │    └── common/   <- EmptyStates, Loaders
 ├── features/      <- Feature Modules
 │    ├── auth/
 │    ├── dashboard/
 │    └── interview/
 ├── styles/        <- CSS & Tokens
 └── lib/           <- Utils & Constants
```

---

## Section 15 — Design Rules
1. **Never use more than one primary CTA per section.**
2. **Maintain consistent 4px grid spacing.**
3. **Avoid visual clutter** — favor whitespace over borders to divide sections.
4. **Use subtle shadows.** Do not rely on them for layout structure.
5. **Use semantic colors only.** No hardcoded hex values in React components.
6. **Maintain consistent animation timing** across the app.
7. **Never mix icon libraries.** Use Lucide React exclusively.



## Home Page Redesign — Clean, Minimal, Professional

Complete rewrite of `src/components/homepage/MobileHomeScreen.tsx`. One file, same component name. No new files needed.

---

### Design System Applied

- Page background: `bg-[#F8F9FA]` wrapper
- All cards: `bg-white border border-[#E5E7EB] shadow-sm rounded-xl`
- Primary accent: `text-[#1D4ED8]` used only on CTAs, active states, icons
- Text hierarchy: `text-[#111827]` headings, `text-[#6B7280]` subtitles, `text-[#9CA3AF]` meta
- No gradient cards anywhere — all removed
- Stagger animation: 100ms delay between sections (`staggerChildren: 0.1`)

---

### Section-by-Section Changes

**1. Header** — Keep existing structure but change username gradient to solid `text-[#1D4ED8]`. Keep bell + avatar + gradient strip background.

**2. Search bar** — White bg, `border-[#E5E7EB]`, `rounded-xl`. Add `SlidersHorizontal` icon on the right side. Update placeholder text to include "ville...".

**3. Quick actions** — Remove all gradient icon backgrounds. White cards with `border-[#E5E7EB]`, icon in `text-[#1D4ED8]`, label in `text-[#111827]` below.

**4. Urgent banner** — Replace red gradient with white card + `border-l-4 border-red-500`. Red pulsing dot + "URGENT" badge (red text, red/10 bg). Title black, subtitle gray. ChevronRight.

**5. Services de santé** — New `SectionHeader` style: 11px uppercase gray label + 16px semibold title. White scroll cards with blue icon top-left, bold title, gray subtitle. No gradient fills.

**6. Annonces médicales** — Switch from horizontal scroll to 2-column grid. White cards, tag badges (Promo = blue bg/10, Événement = gray bg). Title 14px medium, provider gray.

**7. Recherche médicale** — White list rows with `BookOpen` icon in gray, title + author + reads. Thin divider between rows. ChevronRight.

**8. Communauté** — Switch from horizontal scroll to 2-column grid. White cards, outline badges (Expérience = blue outline, Question = gray outline). Title + comment count.

**9. Accès rapide** — 3 vertical tiles (not 2 gradient cards). White cards with colored left border (blue for IA, gray for others). Icon + label + subtitle + arrow right. Equal height.

**10. Footer spacer** — `pb-20` (80px) at bottom.

**SectionHeader redesign** — Two lines: `text-[11px] uppercase tracking-widest text-[#9CA3AF]` label on top, `text-base font-semibold text-[#111827]` title below. "Voir tout →" link aligned right. Remove icon prop.

**QuickCard removed** — replaced by the new accès rapide tile design inline.

---

### File Changed
- `src/components/homepage/MobileHomeScreen.tsx` — full rewrite




# Redesign "Nos Services" Section -- GoodDay-Inspired Layout

## Overview

Replace the current flat grid of service cards with a visually rich, two-zone layout: large feature cards on top (primary services) and an auto-scrolling marquee ticker on the bottom (secondary services), with polished animations and hover effects.

## Changes

### 1. Rewrite `src/components/homepage/ServicesGrid.tsx`

The entire component will be rebuilt with three zones:

**Heading Block** (centered)
- Bold title: "Tout ce dont vous avez besoin"
- Subtitle describing the platform
- Subtle CTA link to `/search`
- Fade-in on scroll using framer-motion

**Top Row -- Primary Feature Cards** (3 cards in a responsive grid)
- Services: Recherche (`/search`), Carte Interactive (`/map`), Urgences (`/map/emergency`)
- Each card: ~280px tall, rounded-[14px], soft shadow
- Top area (~200px): light neutral background (`bg-muted/20`) with a stylized wireframe/mockup illustration built from Lucide icons and simple shapes (e.g., search bars, map pins, pulse lines)
- Bottom strip (~60px): white background, icon left + service name right
- Hover: `translateY(-6px)`, deeper shadow, subtle border accent color
- Staggered fade-in + slide-up on scroll (~100ms delay between cards)

**Bottom Row -- Secondary Services Marquee**
- Services: Pharmacies, Laboratoires, Cliniques, Ambulances, Infirmiers, Soins a domicile, Avis & Reviews, Annonces, Generalistes, Specialistes
- Infinite horizontal auto-scroll (CSS animation, no JS interval)
- Each item: pill-shaped mini-card with icon + label
- Pauses on hover (CSS `animation-play-state: paused`)
- Content duplicated for seamless loop

### 2. Add marquee keyframe to `tailwind.config.ts`

Add a new `marquee` keyframe and animation:
```
keyframes: {
  marquee: {
    '0%': { transform: 'translateX(0)' },
    '100%': { transform: 'translateX(-50%)' },
  }
}
animation: {
  marquee: 'marquee 30s linear infinite',
}
```

### 3. No other files change

The component is self-contained. `AntigravityIndex.tsx` already imports `ServicesGrid` -- no routing or page changes needed.

## Technical Details

- **Mockup illustrations**: Built purely from Lucide icons + simple div shapes (no images needed). For example, the "Recherche" card shows a search bar wireframe with result lines; "Carte" shows map pin icons on a grid; "Urgences" shows a pulsing heart icon.
- **Marquee**: Pure CSS animation using duplicated content inside a flex container. The parent has `overflow-hidden`, the inner flex row animates `translateX(-50%)`. On hover, `animation-play-state: paused`.
- **Responsive**: Top row switches to single column on mobile (`grid-cols-1 md:grid-cols-3`). Marquee stays horizontal but slows down on mobile via a media query or reduced animation duration.
- **Framer Motion**: Used for scroll-triggered staggered entrance of the top cards and heading. The marquee uses pure CSS for performance.


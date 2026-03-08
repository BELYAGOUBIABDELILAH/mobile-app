

## Redesign Main Page — Header Shape + Styling Updates

### Changes to `src/components/homepage/MobileHomeScreen.tsx`

#### 1. Header Area with Background Shape
- Replace lines 148-212 (header + hero + search) with a single block:
  - A `div` with `bg-primary rounded-b-[32px]` extending full-width (`-mx-4`) covering greeting, hero text, and search bar
  - **Top row**: Settings icon (left, `SettingsIcon` from lucide) + Avatar (right, larger `h-11 w-11`)
  - **Greeting**: `👋 Welcome Back` in `text-primary-foreground/70 text-sm`
  - **Hero text**: `"Let's find your\nDocteur!"` in `text-3xl md:text-4xl font-extrabold text-primary-foreground leading-tight`
  - **Search bar**: Positioned at the bottom of the blue area with negative margin (`-mb-6 relative z-10`) so it overlaps/straddles the edge. White bg, `rounded-xl shadow-md`, same functional behavior

#### 2. Categories Section
- Keep existing categories array and navigation logic
- Change category items from square `rounded-2xl` to **rounded cards**: `rounded-2xl bg-card border shadow-sm px-4 py-3` with icon + label side by side (horizontal pill style matching reference)
- Keep horizontal scroll with `snap-x`

#### 3. Symptoms Section — Replace emojis with icons
- Replace the `symptoms` array: remove `emoji` field, add `icon` field using lucide icons:
  - Headache → `Brain`, Nausea → `Frown`, Fever → `Thermometer`, Fatigue → `Moon`, Allergy → `Pill`, Breathing → `Wind`, Chest pain → `HeartPulse`
- Render icon instead of emoji span in the chip
- Keep same navigation to `/medical-assistant?symptom=...`

#### 4. Top Doctors — Limit to 3
- Change `.slice(0, 5)` → `.slice(0, 3)`
- Keep existing card layout (already matches reference well)

#### 5. Everything below Top Doctors stays unchanged
- Quick actions, blood donation, emergency, health services, ads, articles, community, entraide, quick access — all untouched

### Files Modified
- `src/components/homepage/MobileHomeScreen.tsx` only


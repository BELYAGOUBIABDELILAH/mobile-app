

## Changes to `src/components/homepage/MobileHomeScreen.tsx`

### 1. Move search bar inside the blue header
- Move the search form (lines 202-214) inside the `bg-primary rounded-b-[32px]` container (before the closing `</motion.div>` at line 199)
- Add bottom padding to the header and position the search bar at the bottom with `mb-[-24px] relative z-10` so it still overlaps the edge
- Remove the separate search `<motion.form>` block (lines 202-214)

### 2. Ensure Top Doctors section appears right after Symptoms
- The Top Doctors section (lines 258-293) already sits directly after Symptoms — no reordering needed. It stays as-is with 3 doctor cards.

### 3. Remove the "Accès rapide" (Quick Access) section
- Delete the Quick Access section header and list (lines 512-532), including the `quickAccess` array definition (lines 114-125)

No other sections are changed.


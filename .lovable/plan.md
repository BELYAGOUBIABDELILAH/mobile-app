

## Analysis

Both `/citizen/login` and `/citizen/register` pages use the same layout pattern:
- Left branding panel hidden on mobile (`hidden lg:flex`) -- correct
- Right form panel takes full width with `flex-1 flex items-center justify-center p-6`

**Problem identified:** Both pages use `items-center justify-center` on the form container. On small mobile screens (especially the register page with 5+ form fields, Google button, divider, password strength indicator), the form can be taller than the viewport. With `items-center`, the content gets vertically centered and **clips at the top**, making the logo and top fields unreachable.

## Plan

### 1. Fix `CitizenRegisterPage.tsx` (line 314)
Change the form container from vertical centering to a scrollable layout:
- Replace `flex items-center justify-center p-6 sm:p-10` with `flex items-start justify-center p-6 sm:p-10 overflow-y-auto`
- Add `py-8 sm:py-12` to the inner `motion.div` so there's breathing room at top/bottom instead of relying on flex centering

### 2. Fix `CitizenLoginPage.tsx` (line 173)
Same fix for consistency -- the login form is shorter but can still overflow on very small screens (iPhone SE, 320px):
- Replace `flex items-center justify-center` with `flex items-start justify-center overflow-y-auto`
- Add vertical padding to inner content

Both changes are minimal -- just swapping flex alignment and adding scroll support so the full form is always accessible on mobile.


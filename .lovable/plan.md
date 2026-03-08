

## Plan: Improve Authentication Pages

### Important Note
This project uses **Firebase Auth** (not Supabase Auth). All auth methods will use Firebase equivalents:
- `sendPasswordResetEmail()` instead of Supabase `resetPasswordForEmail()`
- `confirmPasswordReset(auth, oobCode, newPassword)` instead of Supabase `updateUser()`
- Google login already uses Firebase `signInWithPopup` — it's already on both login/register pages but the UI will be polished

---

### 1. Create `/forgot-password` page (`src/pages/ForgotPasswordPage.tsx`)

- Extract the existing inline forgot-password from `CitizenLoginPage` into a standalone page
- Centered card (white, rounded-2xl, shadow-md, bg `#F8F9FA`)
- CityHealth logo + "Mot de passe oublié" title + subtitle
- Email input → "Envoyer le lien" blue button
- "← Retour à la connexion" link → `/citizen/login`
- After submit: animated green checkmark, "Email envoyé !" title, "Renvoyer l'email" ghost button with 60s cooldown
- Uses Firebase `sendPasswordResetEmail(auth, email, { url: origin + '/reset-password' })`

### 2. Create `/reset-password` page (`src/pages/ResetPasswordPage.tsx`)

- Firebase sends a link with `oobCode` query param
- On load: extract `oobCode` from URL, verify with `verifyPasswordResetCode(auth, oobCode)`
- "Nouveau mot de passe" title
- Password + confirm password inputs with show/hide toggle
- Password strength indicator (Weak/Fair/Strong) based on: 8+ chars, 1 uppercase, 1 number, 1 special char
- "Réinitialiser" button disabled until passwords match + strong enough
- On submit: `confirmPasswordReset(auth, oobCode, newPassword)`
- On success: redirect to `/` with toast "Mot de passe mis à jour ✓"

### 3. Update `CitizenLoginPage` 

- Replace inline forgot-password UI with `navigate('/forgot-password')` link
- Polish Google button: white bg, border `#E5E7EB`, rounded-xl, Google "G" logo, "Continuer avec Google", divider "ou continuer avec"
- The Google button already exists but will get the requested styling

### 4. Update `CitizenRegisterPage`

- Add Google sign-in button with same styling as login page
- Add "ou continuer avec" divider between form and Google button (if not already present)

### 5. Update `App.tsx`

- Add lazy imports and routes for `/forgot-password` and `/reset-password`

### Files to create/modify:
- **Create**: `src/pages/ForgotPasswordPage.tsx`
- **Create**: `src/pages/ResetPasswordPage.tsx`
- **Modify**: `src/pages/CitizenLoginPage.tsx` (simplify forgot password, polish Google button)
- **Modify**: `src/pages/CitizenRegisterPage.tsx` (add/polish Google button)
- **Modify**: `src/App.tsx` (add 2 routes)


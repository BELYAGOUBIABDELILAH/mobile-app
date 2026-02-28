

## Problem
Firebase's default email verification page shows "Your email has been verified. You can now sign in with your new account" instead of redirecting directly to the app. This happens because the Lovable preview domain is likely not in Firebase's authorized domains list, so `handleCodeInApp: true` fails silently and the fallback sends a plain verification email that uses Firebase's hosted page.

## Solution

Two-pronged approach to ensure the user always ends up on their dashboard:

### 1. Fix `sendEmailVerification` in `src/contexts/AuthContext.tsx`
- Keep `handleCodeInApp: true` with the `continueUrl` pointing to `/email-verified`
- **Also set the fallback** to use `continueUrl` (without `handleCodeInApp`) so that even on Firebase's hosted page, the "Continue" button redirects to `/email-verified` instead of a generic page

### 2. Update `src/pages/EmailVerifiedPage.tsx` to handle both flows
- **Flow A (handleCodeInApp works):** URL contains `oobCode` → call `applyActionCode` → auto-login → redirect to dashboard (already implemented)
- **Flow B (Firebase hosted page, user clicks "Continue"):** URL has NO `oobCode` but email is already verified → attempt auto-login with stored credentials → redirect to dashboard
- Add logic: if no `oobCode` in URL, check `sessionStorage` for stored credentials, sign in, and redirect. If no credentials either, redirect to `/citizen/login`.

### Changes

**`src/contexts/AuthContext.tsx`** (lines ~427-443)
- Update fallback `sendEmailVerification` to include `url: \`\${window.location.origin}/email-verified\`` (without `handleCodeInApp`) so the "Continue" link on Firebase's page points to our app

**`src/pages/EmailVerifiedPage.tsx`**
- In the `verifyAndLogin` effect, if `oobCode` is missing, don't show an error. Instead:
  - Try auto-login with `sessionStorage` credentials
  - If successful, redirect to dashboard
  - If no credentials, redirect to `/citizen/login`
- This handles the case where the user arrives from Firebase's "Continue" button (no `oobCode`, but email already verified)


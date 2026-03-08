

## Plan: Improve Medical Assistant Page

### 1. Update `src/pages/MedicalAssistantPage.tsx`
- Add "Nouvelle conversation" button (PenSquare icon) to the header, between the title area and the emergency button
- Add confirmation dialog (AlertDialog) for clearing conversation
- Pass a `resetChat` callback and `onReset` trigger down to `SymptomTriageBot`
- French translations are already correct in this file — no changes needed there

### 2. Update `src/components/medical-assistant/SymptomTriageBot.tsx`

**French text fixes:**
- The `helper` text for FR already says "Entrée pour envoyer · Shift+Entrée pour un retour à la ligne" — update to exact requested wording: "Entrée pour envoyer · Maj+Entrée pour nouvelle ligne"

**Replace quick symptom chips (FR set — 12 items with emoji icons):**
Replace the current 6 icon-based chips with 12 emoji-labeled chips in a 2-column scrollable grid:
1. 🤒 Fièvre → "J'ai de la fièvre, que dois-je faire ?"
2. 🫀 Douleur thoracique → "J'ai une douleur dans la poitrine"
3. 🤕 Maux de tête → "J'ai des maux de tête fréquents et intenses"
4. 🤢 Nausées / Vomissements → "J'ai des nausées et vomissements"
5. 😮‍💨 Difficultés respiratoires → "J'ai des difficultés à respirer"
6. 💊 Problème de médicament → "J'ai un problème avec mon médicament"
7. 🦷 Douleur dentaire → "J'ai une douleur dentaire intense"
8. 👁️ Problème de vision → "Ma vue a baissé récemment"
9. 🤰 Suivi grossesse → "Je cherche un suivi de grossesse"
10. 🩸 Don de sang → "Je souhaite faire un don de sang"
11. 😰 Stress / Anxiété → "Je souffre de stress et d'anxiété"
12. 🏥 Trouver un médecin → "Aidez-moi à trouver un médecin"

**Chip styling:** White card, border `#E5E7EB`, rounded-xl (12px), emoji 20px left + label 13px medium. Hover: border `#1D4ED8`, light blue bg. On tap: fill input and auto-focus (don't auto-send).

**Typing indicator:** Replace current loading indicator with 3 bouncing dots (8px gray circles, staggered CSS bounce animation with 0/150/300ms delays) in a white bubble matching AI response style.

**New conversation reset:** Accept a `resetKey` prop; when it changes, clear `messages` state and refocus input.

### 3. Files to modify
- `src/pages/MedicalAssistantPage.tsx` — add new conversation button + AlertDialog
- `src/components/medical-assistant/SymptomTriageBot.tsx` — chips, typing indicator, French text, reset support


# Solution Design: English Learning Architecture

## Architecture Overview
The feature consists of three main parts:
1. **Content Script**: Monitors user interaction (hover/select) and injects the UI.
2. **Background Service**: Handles API calls to OpenClaw Gateway for translations and TTS.
3. **Popup/Sidepanel UI**: Manages the "Flashcard" collection and settings.

## Technical Details

### 1. Interaction Logic
- Use `mouseover` and `mouseup` events.
- Debounce hover detection (200ms) to avoid flickering.

### 2. UI: Liquid Glass Tooltip
- Component: `FloatingTooltip.tsx`.
- Styling: Tailwind CSS with backdrop-blur-md, bg-white/10, border-white/20.
- Animation: Framer Motion for "organic" pop-in effects.

### 3. Backend Integration
- API: `/api/v1/translate` (Custom endpoint on Gateway).
- Memory: Save to `memory/vocabulary-learned.json` via Eternal Memory API.

## Data Flow
User Hovers -> Capture Text -> Send to Background -> Query LLM (Gemini/GPT) via Gateway -> Return JSON -> Render Tooltip.

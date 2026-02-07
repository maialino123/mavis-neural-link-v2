# Implementation Tasks: English Learning Mode

## Phase 1: Core Logic (Content Script)
- [x] Create `src/content/CaptureEngine.ts` to detect word under cursor.
- [x] Implement `src/components/LiquidTooltip.tsx` with Framer Motion.
- [ ] Add messaging between Content Script and Background Service.

## Phase 2: Translation & Intelligence
- [ ] Implement `src/background/TranslatorService.ts`.
- [ ] Define API schema for OpenClaw Gateway translation requests.
- [ ] Add TTS integration (using Web Speech API or ElevenLabs).

## Phase 3: Persistent Memory
- [ ] Create `learnedWords` store in Chrome storage.
- [ ] Implement sync to OpenClaw Eternal Memory.

## Phase 4: UI Refinement
- [ ] Apply Liquid Glass styling to all tooltips.
- [ ] Create "Daily Words" view in the Extension Popup.

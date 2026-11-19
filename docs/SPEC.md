# SPEC — Remove AI Label for YouTube

## 1. Goal
Chrome extension (Manifest V3, plain JavaScript, also for Edge and Brave) that hides the AI label in the description of YouTube videos. A popup switch turns it on or off. Default: on.

## 2. Data
No external data system. One stored value: `enabled` (boolean) in `chrome.storage.local`.

## 3. Behavior
- On: the label is not visible. Off: the label is visible again, with no reload.
- The setting is saved and shared by all tabs.
- Works after YouTube internal navigation (`yt-navigate-finish` and a MutationObserver).
- The label is found by its text, not by class name. Titles and comments are never touched.

## 4. Out of scope
No other change to YouTube. No data collected. No network requests. No Web Store publishing.

## 5. Build order
1. **Step 1 — Extension:** manifest, content script, popup, README, tests. Check: load unpacked, open a video with the label, use the switch.

## 6. Workflow settings
- **Playbook source/ref:** claude-project-playbook 3b4b7ae0c292237cc436d6aa58166e90ee377393 (as named in CLAUDE.md; docs copied in this repo).
- **Profile:** Standard. **Approval mode:** Strict. **Owner:** Simone.
- **Allowed external writes:** none. **Approved dependencies:** none.
- **Project commands:** lint: none; build: none; tests: `npm test`.

## 7. Decision log
| Date | Decision | Decided by | § |
|---|---|---|---|
| 2026-11-19 | Brief from Notion task used as spec v1 draft (not yet approved by owner) | worker | all |

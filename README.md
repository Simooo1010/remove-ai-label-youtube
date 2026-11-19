# Remove AI Label for YouTube

A Chrome extension (Manifest V3, plain JavaScript) that hides the AI label in the description of YouTube videos. It also works in Edge and Brave. A switch in the popup turns it on or off. It is on by default.

- No network requests. No data is collected.
- The only stored value is the on/off switch (`chrome.storage.local`).
- Permission used: `storage`.

## Install (unpacked)

1. Download or clone this repository.
2. Open `chrome://extensions` (Edge: `edge://extensions`, Brave: `brave://extensions`).
3. Turn on **Developer mode**.
4. Click **Load unpacked** and select the repository folder (the one with `manifest.json`).
5. Open a YouTube video. Click the extension icon to turn the label hiding on or off.

## How it works

`src/content.js` watches the video description for the label text and marks the matching element. `src/content.css` hides marked elements only while the switch is on. When you switch off, the label shows again at once, with no reload. The script runs again after YouTube's internal navigation.

The label is found by its text (English, Italian, Spanish, French, German phrases), not by a fixed YouTube class name. This is more stable when YouTube changes its page. To add a language, add its phrase to `PHRASES` in `src/content.js`.

## Tests

```
npm test
```

Unit tests use Node's built-in test runner. The browser test needs Playwright with Chromium (`require('playwright')`). It loads a fixture page, not YouTube.

## Not included

No other change to YouTube. No Web Store publishing.
